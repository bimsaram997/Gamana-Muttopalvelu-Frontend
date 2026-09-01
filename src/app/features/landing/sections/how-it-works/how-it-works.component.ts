import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';
import { Subscription } from 'maplibre-gl';
import { ProcessStepResponseDto } from '../../../../models/admin.dto';
import { Router } from '@angular/router';
import { ProcessStepsAdminService } from '../../../../services/admin/process-steps-admin.service';
import { LanguageService } from '../../../../services/language.service';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css'
})
export class HowItWorksComponent implements OnInit, OnDestroy{
private subs: Subscription[] = [];
  currentLanguage: string = 'en';
  private langSub!: Subscription;
  steps: ProcessStepResponseDto[] = [];

   constructor(private router: Router,
        public languageService: LanguageService, // Changed to public so template can read it
          private cdr: ChangeDetectorRef,
          private processStepsAdminService: ProcessStepsAdminService
    ) { }
  
    ngOnInit(): void {
      this.langSub = this.languageService.currentLanguage$.subscribe(lang => {
        console.log('PricingPackagesComponent received new language:', lang);
        this.currentLanguage = lang;
        this.cdr.detectChanges(); // Force instant UI re-render
      });
      this.getAllSteps();
    }
  
    getAllSteps(): void {
      const sub = this.processStepsAdminService.getAll().subscribe(
        (response: any) => {
          this.steps = response;
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
