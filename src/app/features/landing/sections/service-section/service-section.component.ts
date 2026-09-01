import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';
import { Router } from '@angular/router';
import { LanguageService } from '../../../../services/language.service';
import { DetailedServicesAdminService } from '../../../../services/admin/detailed-services-admin.service';
import { DetailedServiceResponseDto } from '../../../../models/admin.dto';
import { Subscription } from 'maplibre-gl';

@Component({
  selector: 'app-service-section',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './service-section.component.html',
  styleUrl: './service-section.component.css'
})
export class ServiceSectionComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  currentLanguage: string = 'en';
  private langSub!: Subscription;
  services: DetailedServiceResponseDto[] = [];

  constructor(public languageService: LanguageService,
    private detailedServicesAdminService: DetailedServicesAdminService,
    private router: Router,
    private cdr: ChangeDetectorRef) { }
 ngOnInit(): void {
    // 1. Subscribe to language changes from the Navbar
    const langSub = this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
      this.cdr.detectChanges(); // Refresh template bindings instantly
    });
    this.subs.push(langSub);

    // 2. Fetch services from backend API
    this.loadServices();
  }

  loadServices(): void {
    const apiSub = this.detailedServicesAdminService.getAll().subscribe({
      next: (data: DetailedServiceResponseDto[]) => {
        this.services = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load services:', err)
    });
    this.subs.push(apiSub);
  }

  // Helper for hardcoded section static text
  t(key: string): string {
    return this.languageService.translate(key);
  }

  // Helper for dynamic backend DTO translations
  getTranslation<T extends { languageCode: string }>(translations: T[] | undefined): T | undefined {
    if (!translations || translations.length === 0) return undefined;
    
    return translations.find(t => t.languageCode.toLowerCase() === this.currentLanguage.toLowerCase()) 
        || translations[0];
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
