import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';
import { Router } from '@angular/router';
import { PackageAdminService } from '../../../../services/admin/package-admin.service';
import { PackageResponseDto } from '../../../../models/admin.dto';
import { LanguageService } from '../../../../services/language.service';
import { Subscription } from 'rxjs';
import { PageLoadingService } from '../../../../services/page-loading.service';

@Component({
  selector: 'app-pricing-packages',
  standalone: true,
  imports: [MATERIAL_COMPONENTS], // Removed TranslatePipe dependency
  templateUrl: './pricing-packages.component.html',
  styleUrl: './pricing-packages.component.css'
})
export class PricingPackagesComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  packages: PackageResponseDto[] = [];
  currentLanguage: string = 'en';
  private langSub!: Subscription;

  constructor(
    private router: Router,
    private packageAdminService: PackageAdminService,
    public languageService: LanguageService, // Changed to public so template can read it
    private cdr: ChangeDetectorRef,
     private pageLoadingService: PageLoadingService
  ) { }

  ngOnInit(): void {
    this.langSub = this.languageService.currentLanguage$.subscribe(lang => {
      console.log('PricingPackagesComponent received new language:', lang);
      this.currentLanguage = lang;
      this.cdr.detectChanges(); // Force instant UI re-render
    });
    this.getAllPackages();
  }

  // Helper method for static hardcoded UI text
  t(key: string): string {
    return this.languageService.translate(key);
  }

getAllPackages(): void {
  this.pageLoadingService.setPricingLoaded(false);

  const sub = this.packageAdminService.getAll().subscribe({
    next: (response: any) => {
      this.packages = response;

      this.pageLoadingService.setPricingLoaded(true);

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Failed to load packages:', err);

      // Stop the skeleton even if the API fails
      this.pageLoadingService.setPricingLoaded(true);
    }
  });

  this.subs.push(sub);
}
  getTranslation<T extends { languageCode: string }>(translations: T[]): T | undefined {
    if (!translations || translations.length === 0) return undefined;
    
    return translations.find(t => t.languageCode.toLowerCase() === this.currentLanguage.toLowerCase()) 
        || translations[0];
  }

  selectPackageAndBook(packageId: number): void {
    this.router.navigate(['/booking'], {
      queryParams: { packageId: packageId }
    });
  }

  ngOnDestroy(): void {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
    this.subs.forEach(sub => sub?.unsubscribe());
  }
}