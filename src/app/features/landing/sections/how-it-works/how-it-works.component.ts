import { Component } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css'
})
export class HowItWorksComponent {
steps: any[] = [
    {
      number: '01',
      title: 'Book Online or Request Offer',
      description: 'Choose your preferred date, pick-up and destination locations, and selecting any needed extras like assembly or cleaning.',
      icon: 'edit_calendar'
    },
    {
      number: '02',
      title: 'We Pack & Load',
      description: 'Our team arrives on time with a spacious van, equipment, and protective materials to safely carry and load your items.',
      icon: 'inventory_2'
    },
    {
      number: '03',
      title: 'Transport & Delivery',
      description: 'We safely transport your belongings to your new home or location in Tampere or anywhere across Finland.',
      icon: 'local_shipping'
    }
  ];
}
