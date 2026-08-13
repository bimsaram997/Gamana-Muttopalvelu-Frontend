import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material Imports
import { MatStepperIntl, MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ActivatedRoute } from '@angular/router';
import { debounceTime, switchMap, filter, tap } from 'rxjs/operators';
import { BookingService } from '../../../services/booking.service';
import { AddressLookupService } from '../../../services/address-lookup.service';
import { AddressDto, CreateBookingPayload } from '../../../models/dto';

export interface PackageOption {
  id: number;
  title: string;
  price: string;
  ratePerHour: number;
  unit: string;
  popular?: boolean;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-booking-wizard',
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
  providers: [
    MatStepperIntl
  ],
  templateUrl: './booking-wizard.component.html',
  styleUrl: './booking-wizard.component.css'
})
export class BookingWizardComponent implements OnInit {
  serviceForm!: FormGroup;
  detailsForm!: FormGroup;
  scheduleForm!: FormGroup;

  isSubmitted = false;
  isLoading = false;
  minDate = new Date();

  pickupSuggestions: any[][] = [];
  deliverySuggestions: any[] = [];

  packages: PackageOption[] = [
    {
      id: 1,
      title: 'Van Only',
      price: '25€',
      ratePerHour: 25,
      unit: 'per hour',
      description: 'Ideal if you have helpers and just need a spacious moving van with a driver.',
      features: ['Spacious Moving Van', 'Professional Driver', 'Fuel & Local Mileage Included', 'Basic Carrying Support']
    },
    {
      id: 2,
      title: 'Van + 1 Helper',
      price: '45€',
      ratePerHour: 45,
      unit: 'per hour',
      popular: true,
      description: 'Most popular for 1–2 room apartment moves and store pickups.',
      features: ['Spacious Moving Van', '1 Active Helper / Driver', 'Furniture Straps & Protection', 'Assembly / Disassembly Tool Support', 'Transparent Hourly Billing']
    },
    {
      id: 3,
      title: 'Van + 2 Helpers',
      price: '65€',
      ratePerHour: 65,
      unit: 'per hour',
      description: 'Fastest option for larger homes, heavy items, and multi-floor moves.',
      features: ['Spacious Moving Van', '2 Full-Time Helpers', 'Complete Heavy Lifting', 'Maximum Protection & Care', 'Fast Load & Unload Time']
    }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private addressLookupService: AddressLookupService
  ) {
    this.createForms();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['packageId']) {
        const pkgId = Number(params['packageId']);
        this.serviceForm.patchValue({ selectedPackageId: pkgId });
      }
    });

    this.setupAddressAutocomplete();
  }

  createForms(): void {
    this.serviceForm = this.fb.group({
      selectedPackageId: [2, Validators.required],
      estimatedHours: [2, [Validators.required, Validators.min(1)]],
      includeCleaning: [false]
    });

    this.detailsForm = this.fb.group({
      pickupLocations: this.fb.array([this.createPickupGroup()]),
      deliveryLocation: this.createAddressGroup(),
      notes: ['']
    });

    this.scheduleForm = this.fb.group({
      moveDate: ['', Validators.required],
      moveTime: ['09:00', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  private createAddressGroup(): FormGroup {
    return this.fb.group({
      searchQuery: ['', Validators.required],
      label: [''],
      street: [''],
      houseNumber: [''],
      postalCode: [''],
      city: [''],
      latitude: [0],
      longitude: [0],
      floor: [0, [Validators.required, Validators.min(0)]],
      hasElevator: [false]
    });
  }

  private createPickupGroup(): FormGroup {
    return this.createAddressGroup();
  }

  get pickupLocations(): FormArray {
    return this.detailsForm.get('pickupLocations') as FormArray;
  }

  asFormGroup(control: AbstractControl | null): FormGroup {
    return control as FormGroup;
  }

  addPickupLocation(): void {
    this.pickupLocations.push(this.createPickupGroup());
    this.pickupSuggestions.push([]);
    this.listenToPickupSearch(this.pickupLocations.length - 1);
  }

  removePickupLocation(index: number): void {
    if (this.pickupLocations.length > 1) {
      this.pickupLocations.removeAt(index);
      this.pickupSuggestions.splice(index, 1);
    }
  }

  private extractSearchText(value: any): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value.properties?.label || value.label || '';
  }

  private setupAddressAutocomplete(): void {
    this.pickupSuggestions = [[]];
    this.listenToPickupSearch(0);

    const deliveryControl = this.detailsForm.get('deliveryLocation.searchQuery');
    deliveryControl?.valueChanges.pipe(
      debounceTime(300),
      filter(val => this.extractSearchText(val).trim().length > 2),
      switchMap(val => this.addressLookupService.searchAddress(this.extractSearchText(val)))
    ).subscribe({
      next: (res) => {
        this.deliverySuggestions = res?.features || res || [];
      },
      error: (err) => console.error('Address search error:', err)
    });
  }

  private listenToPickupSearch(index: number): void {
    const pickupGroup = this.pickupLocations.at(index) as FormGroup;
    pickupGroup.get('searchQuery')?.valueChanges.pipe(
      debounceTime(300),
      filter(val => this.extractSearchText(val).trim().length > 2),
      switchMap(val => this.addressLookupService.searchAddress(this.extractSearchText(val)))
    ).subscribe({
      next: (res) => {
        this.pickupSuggestions[index] = res?.features || res || [];
      },
      error: (err) => console.error('Pickup address search error:', err)
    });
  }

  // Pure arrow function to prevent context binding issues in mat-autocomplete
  displayFn = (feature: any): string => {
    return this.getLabel(feature);
  };

  getLabel(feature: any): string {
    if (!feature) return '';
    if (typeof feature === 'string') return feature;
    return feature.properties?.label || feature.label || feature.name || '';
  }

  onAddressSelected(event: MatAutocompleteSelectedEvent, group: AbstractControl | null): void {
    if (!group) return;

    const feature = event.option.value;
    if (!feature) return;

    const props = feature.properties || feature;
    const coords = feature.geometry?.coordinates || [0, 0];
    const label = this.getLabel(feature);

    group.patchValue({
      searchQuery: label,
      label: label,
      street: props.street || props.name || '',
      houseNumber: props.housenumber || props.houseNumber || '',
      postalCode: props.postalcode || props.postalCode || '',
      city: props.locality || props.city || '',
      latitude: coords[1] || props.latitude || 0,
      longitude: coords[0] || props.longitude || 0
    });
  }

  clearAddress(group: AbstractControl | null, index?: number): void {
    if (!group) return;

    group.patchValue({
      searchQuery: '',
      label: '',
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
      latitude: 0,
      longitude: 0
    });

    if (index !== undefined && this.pickupSuggestions[index]) {
      this.pickupSuggestions[index] = [];
    } else {
      this.deliverySuggestions = [];
    }
  }

  get selectedPkg(): PackageOption {
    const pkgId = Number(this.serviceForm.get('selectedPackageId')?.value);
    return this.packages.find(p => p.id === pkgId) || this.packages[1];
  }

  get calculatedTotal(): number {
    const hours = this.serviceForm.get('estimatedHours')?.value || 1;
    const cleaningExtra = this.serviceForm.get('includeCleaning')?.value ? 110 : 0;
    return (this.selectedPkg.ratePerHour * hours) + cleaningExtra;
  }

  private mapToAddressDto(groupValue: any): AddressDto {
    return {
      label: groupValue.label || groupValue.searchQuery,
      street: groupValue.street,
      houseNumber: groupValue.houseNumber,
      postalCode: groupValue.postalCode,
      city: groupValue.city,
      latitude: groupValue.latitude,
      longitude: groupValue.longitude,
      floor: groupValue.floor,
      hasElevator: groupValue.hasElevator
    };
  }

  submitBooking(): void {
    if (this.serviceForm.valid && this.detailsForm.valid && this.scheduleForm.valid) {
      this.isLoading = true;

      const scheduleVal = this.scheduleForm.value;
      const detailsVal = this.detailsForm.value;
      const serviceVal = this.serviceForm.value;

      const moveDateObj = new Date(scheduleVal.moveDate);
      const [hours, minutes] = scheduleVal.moveTime.split(':');
      moveDateObj.setHours(+hours, +minutes);

      const payload: CreateBookingPayload = {
        selectedPackageId: serviceVal.selectedPackageId,
        estimatedHours: serviceVal.estimatedHours,
        includeCleaning: serviceVal.includeCleaning,
        pickupLocations: detailsVal.pickupLocations.map((p: any) => this.mapToAddressDto(p)),
        dropoffLocation: this.mapToAddressDto(detailsVal.deliveryLocation),
        notes: detailsVal.notes,
        serviceDate: moveDateObj.toISOString(),
        fullName: scheduleVal.fullName,
        email: scheduleVal.email,
        phone: scheduleVal.phone,
        totalPrice: this.calculatedTotal
      };

      this.bookingService.createBooking(payload).subscribe({
        next: () => {
          this.isSubmitted = true;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error submitting booking:', err);
          this.isLoading = false;
        }
      });
    }
  }
}