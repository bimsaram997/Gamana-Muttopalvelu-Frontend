import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MATERIAL_COMPONENTS } from '../../../utills/material-imports';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  selectedLanguage: string = 'en';
  imagePath: string = 'assets/test.jpg';
  private langSub!: Subscription;

  constructor(
    private router: Router,
    public languageService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Sync selectedLanguage display with the RxJS stream
    this.langSub = this.languageService.currentLanguage$.subscribe(lang => {
      this.selectedLanguage = lang.toUpperCase();
      this.cdr.detectChanges(); // Ensures UI updates immediately upon selection
    });
  }

  // Translation helper function for template bindings
  t(key: string): string {
    return this.languageService.translate(key);
  }

  setLanguage(lang: string): void {
    this.languageService.setLanguage(lang.toLowerCase());
  }

  goToBooking(): void {
    this.router.navigate(['/booking']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }
}