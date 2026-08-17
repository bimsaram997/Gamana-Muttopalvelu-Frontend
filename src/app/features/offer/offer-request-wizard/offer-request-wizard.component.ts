import { Component } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../utills/material-imports';
import { MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressLookupService } from '../../../services/address-lookup.service';
import { debounceTime, filter, switchMap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-offer-request-wizard',
  standalone: true,
  imports: [MATERIAL_COMPONENTS, MatStepperModule,],
  templateUrl: './offer-request-wizard.component.html',
  styleUrl: './offer-request-wizard.component.css'
})
export class OfferRequestWizardComponent {
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
    //private offerRequestService: OfferRequestService,
    private addressLookupService: AddressLookupService
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

    // Step 2: Departure Address
    this.departureForm = this.fb.group({
      searchQuery: [''],
      street: [''],
      houseNumber: [''],
      city: [''], // Post office
      postalCode: [''], // Postcode
      apartmentAreaM2: [null, [Validators.required, Validators.min(1)]], // Apartment area m2*
      floor: [0, [Validators.required, Validators.min(0)]],
      hasElevator: [false],
      latitude: [0],
      longitude: [0]
    });

    // Step 3: Destination Address (Where are we moving to?)
    this.destinationForm = this.fb.group({
      searchQuery: ['', Validators.required], // Destination address*
      street: [''],
      houseNumber: [''],
      city: ['', Validators.required], // Post office*
      postalCode: ['', Validators.required], // Postcode*
      floor: [0, [Validators.required, Validators.min(0)]],
      hasElevator: [false],
      latitude: [0],
      longitude: [0]
    });

    // Step 4: Additional Information
    this.additionalInfoForm = this.fb.group({
      serviceIds: [[]], // Array of numeric service IDs (e.g., [1, 3])
      notes: ['', [Validators.maxLength(500)]],
      privacyAgreed: [false, Validators.requiredTrue] // Privacy agreement checkbox*
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

  sendOfferRequest(event?: Event): void {
    if (event) event.preventDefault();

    if (
      this.contactForm.valid &&
      this.departureForm.valid &&
      this.destinationForm.valid &&
      this.additionalInfoForm.valid
    ) {
      this.isLoading = true;

      const payload = {
        fullName: this.contactForm.value.fullName,
        email: this.contactForm.value.email,
        phone: this.contactForm.value.phone,
        desiredMovingDate: this.contactForm.value.moveDate,
        departureAddress: {
          ...this.departureForm.value,
          apartmentAreaM2: Number(this.departureForm.value.apartmentAreaM2),
          floor: Number(this.departureForm.value.floor)
        },
        destinationAddress: {
          ...this.destinationForm.value,
          floor: Number(this.destinationForm.value.floor)
        },
        serviceIds: (this.additionalInfoForm.value.serviceIds || []).map((id: any) => Number(id)), // Array of numeric IDs
        additionalInfo: this.additionalInfoForm.value.notes,
        privacyAgreed: this.additionalInfoForm.value.privacyAgreed
      };

      // this.offerRequestService.submitOfferRequest(payload).subscribe({
      //   next: (res: any) => {
      //     this.isSubmitted = true;
      //     this.isLoading = false;
      //   },
      //   error: (err) => {
      //     console.error('Error submitting offer request:', err);
      //     this.isLoading = false;
      //   }
      // });
    }
  }
}
