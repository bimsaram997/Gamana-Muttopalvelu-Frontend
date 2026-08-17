import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { debounceTime, switchMap, filter } from 'rxjs/operators';
import { BookingService } from '../../../services/booking.service';
import { AddressLookupService } from '../../../services/address-lookup.service';
import { AddressDto, CreateBookingPayload } from '../../../models/dto';
import * as polyline from '@mapbox/polyline';
// MapLibre GL Import
import * as maplibregl from 'maplibre-gl';

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
  providers: [MatStepperIntl],
  templateUrl: './booking-wizard.component.html',
  styleUrl: './booking-wizard.component.css'
})
export class BookingWizardComponent implements OnInit, OnDestroy {
  serviceForm!: FormGroup;
  detailsForm!: FormGroup;
  scheduleForm!: FormGroup;

  isSubmitted = false;
  isLoading = false;
  isMapLoading = false;
  minDate = new Date();

  bookingResponse: any = null;

  pickupSuggestions: any[][] = [];
  deliverySuggestions: any[] = [];

  private map: maplibregl.Map | null = null;

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

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
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
    }, { emitEvent: false });
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

  // --- MapLibre Route Renderer ---
  private initConfirmationMap(): void {
    const container = document.getElementById('confirmation-map');
    if (!container) {
      console.error('Map container #confirmation-map not found in DOM.');
      return;
    }

    if (this.map) {
      this.map.remove();
    }

    this.map = new maplibregl.Map({
      container: 'confirmation-map',
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [23.7871, 61.4978],
      zoom: 12
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');

    setTimeout(() => {
      this.map?.resize();
    }, 200);

    this.map.on('load', () => {
      this.map?.resize();
      if (this.bookingResponse?.routeResultDto) {
        this.renderOptimizedRoute(this.bookingResponse.routeResultDto);
      }
    });
  }

  private renderOptimizedRoute(routeResult: any): void {
    if (!this.map || !routeResult) return;

    // 1. Parse Polyline Coordinates
    let rawCoordinates: [number, number][] = [];
    try {
      let parsed = routeResult.encodedPolyline;
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      if (parsed && Array.isArray(parsed.coordinates)) {
        rawCoordinates = parsed.coordinates;
      }
    } catch (e) {
      console.error('Error parsing polyline:', e);
    }

    let routeCoordinates: [number, number][] = rawCoordinates.map((c: [number, number]) => [
      Number(c[0]),
      Number(c[1])
    ]);

    const waypoints = routeResult.optimizedWaypoints || [];
    if (routeCoordinates.length < 2 && waypoints.length >= 2) {
      routeCoordinates = waypoints.map((wp: any) => [wp.longitude, wp.latitude]);
    }

    if (routeCoordinates.length < 2) return;

    // 2. Render Waypoint Markers
    const totalWaypoints = waypoints.length;
    let pickupCounter = 1;

    waypoints.forEach((wp: any, idx: number) => {
      if (wp.latitude == null || wp.longitude == null) return;

      const el = document.createElement('div');
      el.className = 'custom-map-marker';
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'center';
      el.style.cursor = 'pointer';

      if (idx === 0) {
        el.innerHTML = `
          <div style="
            background-color: #198754;
            color: white;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 12px;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border: 2px solid white;
            margin-bottom: 2px;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>🏢</span>
            <span>Office</span>
          </div>
          <div style="
            background-color: #198754;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.4);
          "></div>
        `;
      } else if (idx === totalWaypoints - 1) {
        el.innerHTML = `
          <div style="
            background-color: #D2232A;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
          ">🏁</div>
        `;
      } else {
        const currentNumber = pickupCounter++;
        el.innerHTML = `
          <div style="
            background-color: #0d6efd;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
          ">${currentNumber}</div>
        `;
      }

      new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([wp.longitude, wp.latitude])
        .addTo(this.map!);
    });

    // 3. Create Custom SVG Route Overlay
    const container = this.map.getCanvasContainer();
    let svg = container.querySelector('#map-route-svg') as SVGSVGElement;

    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'map-route-svg';
      svg.style.position = 'absolute';
      svg.style.top = '0';
      svg.style.left = '0';
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.pointerEvents = 'none';
      svg.style.zIndex = '1';
      container.appendChild(svg);
    }

    svg.innerHTML = `
      <defs>
        <marker id="route-arrow" 
                viewBox="0 0 10 10" 
                refX="5" 
                refY="5" 
                markerWidth="6" 
                markerHeight="6" 
                orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#FFFFFF" />
        </marker>
      </defs>
      <path id="svg-route-casing" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
      <path id="svg-route-line" fill="none" stroke="#0b86be" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.95" />
      <g id="svg-route-arrows"></g>
    `;

    const casingPath = svg.querySelector('#svg-route-casing') as SVGPathElement;
    const linePath = svg.querySelector('#svg-route-line') as SVGPathElement;
    const arrowsGroup = svg.querySelector('#svg-route-arrows') as SVGGElement;

    const updateSvgPath = () => {
      if (!this.map) return;

      const screenPoints = routeCoordinates.map(coord => this.map!.project([coord[0], coord[1]]));

      const pathData = screenPoints.map((pt, index) => 
        `${index === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`
      ).join(' ');

      if (casingPath && linePath) {
        casingPath.setAttribute('d', pathData);
        linePath.setAttribute('d', pathData);
      }

      if (arrowsGroup) {
        let arrowHtml = '';
        const stepInterval = 120;
        let accumulatedDistance = 0;

        for (let i = 0; i < screenPoints.length - 1; i++) {
          const p1 = screenPoints[i];
          const p2 = screenPoints[i + 1];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const segmentDist = Math.hypot(dx, dy);

          accumulatedDistance += segmentDist;

          if (accumulatedDistance >= stepInterval && segmentDist > 10) {
            accumulatedDistance = 0;

            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            arrowHtml += `
              <path d="M ${midX - 4} ${midY - 4} L ${midX + 4} ${midY} L ${midX - 4} ${midY + 4} Z" 
                    fill="#FFFFFF" 
                    transform="rotate(${angle}, ${midX}, ${midY})" />
            `;
          }
        }
        arrowsGroup.innerHTML = arrowHtml;
      }
    };

    this.map.on('render', updateSvgPath);
    this.map.on('move', updateSvgPath);
    this.map.on('zoom', updateSvgPath);

    updateSvgPath();

    // 4. Fit Map Bounds
    const bounds = routeCoordinates.reduce(
      (b, coord) => b.extend(coord),
      new maplibregl.LngLatBounds(routeCoordinates[0], routeCoordinates[0])
    );

    this.map.fitBounds(bounds, { padding: 70 });
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

  // --- Step 1 & 2 Execution ---
  submitBooking(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.serviceForm.valid && this.detailsForm.valid && this.scheduleForm.valid) {
      this.isLoading = true;

      const scheduleVal = this.scheduleForm.value;
      const detailsVal = this.detailsForm.value;
      const serviceVal = this.serviceForm.value;

      const moveDateObj = new Date(scheduleVal.moveDate);
      const [hours, minutes] = scheduleVal.moveTime.split(':');
      moveDateObj.setHours(+hours, +minutes, 0, 0);

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

      // 1. Instant POST call to create booking
      this.bookingService.createBooking(payload).subscribe({
        next: (createRes: any) => {
          this.isSubmitted = true;
          this.isLoading = false;
          this.isMapLoading = true;

          // 2. GET call to load complete details & routeResultDto
          const bookingId = createRes.bookingId || createRes.id;
          this.fetchBookingDetails(bookingId);
        },
        error: (err) => {
          console.error('Error submitting booking:', err);
          this.isLoading = false;
        }
      });
    }
  }

  private fetchBookingDetails(bookingId: string): void {
    this.bookingService.getBookingById(bookingId).subscribe({
      next: (detailsRes: any) => {
        this.bookingResponse = detailsRes;
        this.isMapLoading = false;

        setTimeout(() => {
          this.initConfirmationMap();
        }, 100);
      },
      error: (err) => {
        console.error('Error fetching booking details:', err);
        this.isMapLoading = false;
      }
    });
  }
}