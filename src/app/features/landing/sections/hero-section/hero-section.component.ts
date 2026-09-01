import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../../services/language.service';
import { KeyServicesAdminService } from '../../../../services/admin/key-services-admin.service';
import { SimpleServiceResponseDto } from '../../../../models/admin.dto';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  currentLanguage: string = 'en';
  private langSub!: Subscription;
  keyServices: SimpleServiceResponseDto[] = [];


  constructor(private router: Router,
      public languageService: LanguageService, // Changed to public so template can read it
        private cdr: ChangeDetectorRef,
        private keyServicesAdminService: KeyServicesAdminService
  ) { }

  ngOnInit(): void {
    this.langSub = this.languageService.currentLanguage$.subscribe(lang => {
      console.log('PricingPackagesComponent received new language:', lang);
      this.currentLanguage = lang;
      this.cdr.detectChanges(); // Force instant UI re-render
    });
    this.getAllKeyServices();
  }

  getAllKeyServices(): void {
    const sub = this.keyServicesAdminService.getAll().subscribe(
      (response: any) => {
        this.keyServices = response;
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


  goToBooking(): void {
    this.router.navigate(['/booking']);
  }

  gotoOffer(): void {
    this.router.navigate(['/offer']);
  }

   ngOnDestroy(): void {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
    this.subs.forEach(sub => sub?.unsubscribe());
  }
}

