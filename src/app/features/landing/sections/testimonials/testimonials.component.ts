import { Component } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
googleRating = '4.6';
  totalReviews = '50+';

  reviews: any[] = [
    {
      author: 'Mikael K.',
      location: 'Tampere',
      rating: 5,
      comment: 'Super fast and careful movers! They handled my two-bedroom apartment move seamlessly. Very punctual and great hourly rates.',
      date: 'Recent Move',
      serviceUsed: 'Apartment Moving'
    },
    {
      author: 'Sarah L.',
      location: 'Hervanta',
      rating: 5,
      comment: 'Ordered IKEA furniture delivery with assembly help. They picked up the items directly from the store and brought them up to the 4th floor.',
      date: 'Recent Move',
      serviceUsed: 'Store Pickup'
    },
    {
      author: 'Juho P.',
      location: 'Pirkkala',
      rating: 5,
      comment: 'Excellent service. The driver was friendly, strong, and equipped with blankets and straps to keep everything safe during transit.',
      date: 'Recent Move',
      serviceUsed: 'Van + 1 Mover'
    }
  ];
}
