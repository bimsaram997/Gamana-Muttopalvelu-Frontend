import { Component } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../utills/material-imports';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  selectedLanguage: string = 'FI';
  imagePath: string = 'assets/test.jpg';
  setLanguage(lang: string): void {
    this.selectedLanguage = lang;
  }
}
