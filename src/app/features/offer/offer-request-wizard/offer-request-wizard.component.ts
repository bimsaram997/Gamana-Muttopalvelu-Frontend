import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material Imports
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { AddressLookupService } from '../../../services/address-lookup.service';
import { AddressDto, CreateOfferPayload } from '../../../models/dto';
import { OfferService } from '../../../services/offer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-request-wizard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './offer-request-wizard.component.html',
  styleUrl: './offer-request-wizard.component.css'
})
export class OfferRequestWizardComponent implements OnInit {
  contactForm!: FormGroup;
  departureForm!: FormGroup;
  destinationForm!: FormGroup;
  additionalInfoForm!: FormGroup;

  isSubmitted = false;
  isLoading = false;
  minDate = new Date();

  departureSuggestions: any[] = [];
  destinationSuggestions: any[] = [];

  // Services with numeric IDs
  availableServices: any[] = [
    { id: 1, label: 'Packing Service' },
    { id: 2, label: 'Unpacking Service' },
    { id: 3, label: 'Final Cleaning' },
    { id: 4, label: 'Furniture Disassembly / Assembly' },
    { id: 5, label: 'Temporary Storage' }
  ];

  constructor(
    private fb: FormBuilder,
    // private offerRequestService: OfferRequestService,
    private addressLookupService: AddressLookupService,
    private offerService: OfferService,
    private router: Router
  ) {
    this.createForms();
  }

  ngOnInit(): void {
    this.setupAddressAutocomplete();
  }

  private createForms(): void {
    // Step 1: Contact & Date
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      moveDate: ['', Validators.required]
    });

    // Step 2: Departure Address Group (AddressDto structure + UI inputs)
    this.departureForm = this.createAddressGroup(true);

    // Step 3: Destination Address Group (AddressDto structure + UI inputs)
    this.destinationForm = this.createAddressGroup(false);

    // Step 4: Additional Information
    this.additionalInfoForm = this.fb.group({
      serviceIds: [[]],
      notes: ['', [Validators.maxLength(500)]],
      privacyAgreed: [false, Validators.requiredTrue]
    });
  }

  private createAddressGroup(isDeparture: boolean): FormGroup {
    return this.fb.group({
      searchQuery: ['', isDeparture ? [] : [Validators.required]],
      label: [''],
      street: [''],
      houseNumber: [''],
      postalCode: ['', isDeparture ? [] : [Validators.required]],
      city: ['', isDeparture ? [] : [Validators.required]],
      latitude: [0],
      longitude: [0],
      floor: [0, [Validators.required, Validators.min(0)]],
      hasElevator: [false],
      ...(isDeparture && { apartmentAreaM2: [null, [Validators.required, Validators.min(1)]] })
    });
  }

  private setupAddressAutocomplete(): void {
    // Departure Autocomplete
    this.departureForm.get('searchQuery')?.valueChanges.pipe(
      debounceTime(300),
      filter(val => this.extractSearchText(val).trim().length > 2),
      switchMap(val => this.addressLookupService.searchAddress(this.extractSearchText(val)))
    ).subscribe({
      next: (res) => this.departureSuggestions = res?.features || res || [],
      error: (err) => console.error('Departure address search error:', err)
    });

    // Destination Autocomplete
    this.destinationForm.get('searchQuery')?.valueChanges.pipe(
      debounceTime(300),
      filter(val => this.extractSearchText(val).trim().length > 2),
      switchMap(val => this.addressLookupService.searchAddress(this.extractSearchText(val)))
    ).subscribe({
      next: (res) => this.destinationSuggestions = res?.features || res || [],
      error: (err) => console.error('Destination address search error:', err)
    });
  }

  private extractSearchText(value: any): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value.properties?.label || value.label || '';
  }

  displayFn = (feature: any): string => {
    return this.getLabel(feature);
  };

  getLabel(feature: any): string {
    if (!feature) return '';
    if (typeof feature === 'string') return feature;
    return feature.properties?.label || feature.label || feature.name || '';
  }

  onAddressSelected(event: MatAutocompleteSelectedEvent, formGroup: FormGroup): void {
    const feature = event.option.value;
    if (!feature) return;

    const props = feature.properties || feature;
    const coords = feature.geometry?.coordinates || [0, 0];
    const label = this.getLabel(feature);

    formGroup.patchValue({
      searchQuery: label,
      label: label,
      street: props.street || props.name || '',
      houseNumber: props.housenumber || props.houseNumber || '',
      postalCode: props.postalcode || props.postalCode || '',
      city: props.locality || props.city || '',
      latitude: coords[1] || props.latitude || 0,
      longitude: coords[0] || props.longitude || 0
    }, { emitEvent: false });
  }

  clearAddress(formGroup: FormGroup, isDeparture: boolean): void {
    formGroup.patchValue({
      searchQuery: '',
      label: '',
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
      latitude: 0,
      longitude: 0
    });

    if (isDeparture) {
      this.departureSuggestions = [];
    } else {
      this.destinationSuggestions = [];
    }
  }

  private mapToAddressDto(groupValue: any): AddressDto {
    return {
      label: groupValue.label || groupValue.searchQuery,
      street: groupValue.street,
      houseNumber: groupValue.houseNumber,
      postalCode: groupValue.postalCode,
      city: groupValue.city,
      latitude: Number(groupValue.latitude) || 0,
      longitude: Number(groupValue.longitude) || 0,
      floor: Number(groupValue.floor) || 0,
      hasElevator: Boolean(groupValue.hasElevator)
    };
  }

  sendOfferRequest(event?: Event): void {
    if (event) event.preventDefault();

    if (
      this.contactForm.valid &&
      this.departureForm.valid &&
      this.destinationForm.valid &&
      this.additionalInfoForm.valid
    ) {
      this.isLoading = true;

      const payload: CreateOfferPayload = {
        fullName: this.contactForm.value.fullName,
        email: this.contactForm.value.email,
        phone: this.contactForm.value.phone,
        desiredMovingDate: new Date(this.contactForm.value.moveDate).toISOString(),
        departureAddress: this.mapToAddressDto(this.departureForm.value),
        destinationAddress: this.mapToAddressDto(this.destinationForm.value),
        serviceIds: (this.additionalInfoForm.value.serviceIds || []).map((id: any) => Number(id)),
        additionalInfo: this.additionalInfoForm.value.notes,
        privacyAgreed: this.additionalInfoForm.value.privacyAgreed
      };

      console.log('Offer Request Payload:', payload);

       this.offerService.createOffer  (payload).subscribe({
         next: (res: any) => {
           this.isSubmitted = true;
          this.isLoading = false;
         },
       error: (err) => {
          console.error('Error submitting offer request:', err);
           this.isLoading = false;
        }
      });
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}