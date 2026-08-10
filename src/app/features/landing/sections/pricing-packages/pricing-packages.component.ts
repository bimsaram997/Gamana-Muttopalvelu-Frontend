import { Component } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';

@Component({
  selector: 'app-pricing-packages',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './pricing-packages.component.html',
  styleUrl: './pricing-packages.component.css'
})
export class PricingPackagesComponent {
packages: any[] = [
    {
      title: 'Van Only',
      price: '25€',
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
      title: 'Van + 1 Mover',
      price: '45€',
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
      title: 'Van + 2 Movers',
      price: '65€',
      unit: 'per hour',
      description: 'Fastest option for larger homes, heavy items, and multi-floor moves.',
      features: [
        'Spacious Moving Van',
        '2 Full-Time Movers',
        'Complete Heavy Lifting',
        'Maximum Protection & Care',
        'Fast Load & Unload Time'
      ]
    }
  ];
}
