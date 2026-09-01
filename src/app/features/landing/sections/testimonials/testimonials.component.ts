import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';
import { Subscription } from 'maplibre-gl';
import { ReviewAdminService } from '../../../../services/admin/review-admin.service';
import { LanguageService } from '../../../../services/language.service';
import { Router } from '@angular/router';
import { ReviewResponseDto } from '../../../../models/admin.dto';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  googleRating = '4.6';
  totalReviews = '50+';
  private subs: Subscription[] = [];
  currentLanguage: string = 'en';
  private langSub!: Subscription;
  reviews: ReviewResponseDto[] = [];

  constructor(private router: Router,
    public languageService: LanguageService, // Changed to public so template can read it
    private cdr: ChangeDetectorRef,
    private reviewAdminService: ReviewAdminService
  ) { }

  ngOnInit(): void {
    this.langSub = this.languageService.currentLanguage$.subscribe(lang => {
      console.log('PricingPackagesComponent received new language:', lang);
      this.currentLanguage = lang;
      this.cdr.detectChanges(); // Force instant UI re-render
    });
    this.getAllReviews();
    
  }

  getAllReviews(): void {
    const sub = this.reviewAdminService.getAll().subscribe(
      (response: any) => {
        this.reviews = response;
        this.cdr.detectChanges();
      }
    );
    this.subs.push(sub);
  }

    // Helper method for static hardcoded UI text
  t(key: string): string {
    return this.languageService.translate(key);
  }
  getTranslation<T extends { languageCode: string }>(translations: T[]): T | undefined {
    if (!translations || translations.length === 0) return undefined;
    
    return translations.find(t => t.languageCode.toLowerCase() === this.currentLanguage.toLowerCase()) 
        || translations[0];
  }

  ngOnDestroy(): void {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
    this.subs.forEach(sub => sub?.unsubscribe());
  }
}
