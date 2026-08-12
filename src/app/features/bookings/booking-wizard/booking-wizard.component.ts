import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_COMPONENTS } from '../../../utills/material-imports';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
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
  imports: [MATERIAL_COMPONENTS, MatStepperModule, MatSelectModule,],
  templateUrl: './booking-wizard.component.html',
  styleUrl: './booking-wizard.component.css'
})
export class BookingWizardComponent {
serviceForm!: FormGroup;
  detailsForm!: FormGroup;
  scheduleForm!: FormGroup;

  isSubmitted = false;
  minDate = new Date();

  // Updated packages array matching your data structure
  packages: PackageOption[] = [
    {
      id: 1,
      title: 'Van Only',
      price: '25€',
      ratePerHour: 25,
      unit: 'per hour',
      description: 'Ideal if you have helpers and just need a spacious moving van with a driver.',
      features: [
        'Spacious Moving Van',
        'Professional Driver',
        'Fuel & Local Mileage Included',
        'Basic Carrying Support'
      ]
    },
    {
      id: 2,
      title: 'Van + 1 Helper',
      price: '45€',
      ratePerHour: 45,
      unit: 'per hour',
      popular: true,
      description: 'Most popular for 1–2 room apartment moves and store pickups.',
      features: [
        'Spacious Moving Van',
        '1 Active Helper / Driver',
        'Furniture Straps & Protection',
        'Assembly / Disassembly Tool Support',
        'Transparent Hourly Billing'
      ]
    },
    {
      id: 3,
      title: 'Van + 2 Helpers',
      price: '65€',
      ratePerHour: 65,
      unit: 'per hour',
      description: 'Fastest option for larger homes, heavy items, and multi-floor moves.',
      features: [
        'Spacious Moving Van',
        '2 Full-Time Helpers',
        'Complete Heavy Lifting',
        'Maximum Protection & Care',
        'Fast Load & Unload Time'
      ]
    }
  ];

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.createForms();
  }

  ngOnInit(): void {
   this.route.queryParams.subscribe(params => {
      if (params['packageId']) {
        const pkgId = Number(params['packageId']);
        this.serviceForm.patchValue({
          selectedPackageId: pkgId
        });
      }
    });
  }

  createForms(): void {
     this.serviceForm = this.fb.group({
      selectedPackageId: [2, Validators.required],
      estimatedHours: [2, [Validators.required, Validators.min(1)]],
      includeCleaning: [false]
    });

    this.detailsForm = this.fb.group({
      pickupLocations: this.fb.array([this.createPickupGroup()]),
      // Single Delivery Group
      deliveryLocation: this.fb.group({
        address: ['', Validators.required],
        floor: [0, [Validators.required, Validators.min(0)]],
        hasElevator: [false]
      }),
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

 private createPickupGroup(): FormGroup {
    return this.fb.group({
      address: ['', Validators.required],
      floor: [0, [Validators.required, Validators.min(0)]],
      hasElevator: [false]
    });
  }

  get pickupLocations(): FormArray {
    return this.detailsForm.get('pickupLocations') as FormArray;
  }

  addPickupLocation(): void {
    this.pickupLocations.push(this.createPickupGroup());
  }

  removePickupLocation(index: number): void {
    if (this.pickupLocations.length > 1) {
      this.pickupLocations.removeAt(index);
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

  submitBooking(): void {
    if (this.serviceForm.valid && this.detailsForm.valid && this.scheduleForm.valid) {
      const bookingData = {
        service: this.serviceForm.value,
        selectedPackage: this.selectedPkg,
        details: this.detailsForm.value,
        schedule: this.scheduleForm.value,
        estimatedTotal: this.calculatedTotal
      };
      console.log('Booking Submitted:', bookingData);
      this.isSubmitted = true;
    }
  }
}
