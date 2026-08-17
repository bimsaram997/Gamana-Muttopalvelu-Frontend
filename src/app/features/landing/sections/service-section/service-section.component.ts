import { Component } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-section',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './service-section.component.html',
  styleUrl: './service-section.component.css'
})
export class ServiceSectionComponent {
  constructor(private router: Router) {}
services: any[] = [
    {
      title: 'Apartment Moving',
      subtitle: 'Residential Relocations',
      description: 'Full-service house and apartment moves in Tampere and nationwide. Safe handling, loading, and transport.',
      icon: 'apartment',
      highlights: ['Local & Intercity', 'Safe Furniture Protection', 'Starting at 25€/h']
    },
    {
      title: 'Store Pickups',
      subtitle: 'IKEA, JYSK, Masku, Asko',
      description: 'Bought new furniture? We pick up heavy items directly from store warehouses or second-hand shops and deliver to your door.',
      icon: 'storefront',
      highlights: ['Same-Day Options', 'Heavy Item Delivery', 'Assembly Support']
    },
    {
      title: 'City & Long Transfers',
      subtitle: 'Intercity Transport',
      description: 'Moving between Tampere, Helsinki, Turku, or anywhere across Finland with fixed transparent rates.',
      icon: 'local_shipping',
      highlights: ['Nationwide Reach', 'Flexible Schedule', 'Reliable Transport']
    },
    {
      title: 'Move-Out Cleaning',
      subtitle: 'Muuttosiivous',
      description: 'Thorough cleaning services to leave your old apartment in flawless condition for landlord inspection.',
      icon: 'cleaning_services',
      highlights: ['Landlord Guarantee', 'Deep Kitchen & Bath', 'Eco-Friendly Products']
    }
  ];

   gotoOffer(): void {
    this.router.navigate(['/offer']);
  }
}
