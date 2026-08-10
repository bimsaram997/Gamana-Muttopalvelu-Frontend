import { Component } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  phoneNumber = '+358 41 471 4856';
  phoneHref = 'tel:+358414714856';
  whatsappHref = 'https://wa.me/358414714856';
}
