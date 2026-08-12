import { Component } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent {

  constructor(private router: Router) {}
keyServices = [
    'Apartment moving',
    'IKEA / JYSK / Masku / Asko pickups',
    'City transfers',
    'Furniture delivery',
    "Final cleaning"
  ];

  goToBooking(): void {
    this.router.navigate(['/booking']);
  }
}
