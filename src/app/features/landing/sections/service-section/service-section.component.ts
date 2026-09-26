import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';
import { Router } from '@angular/router';
import { LanguageService } from '../../../../services/language.service';
import { DetailedServicesAdminService } from '../../../../services/admin/detailed-services-admin.service';
import { DetailedServiceResponseDto } from '../../../../models/admin.dto';
import { Subscription } from 'rxjs';
import { PageLoadingService } from '../../../../services/page-loading.service';

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
  currentPage: number = 0;
  readonly servicesPerPage: number = 4;
  isPageChanging = false;
  pageDirection: 'next' | 'previous' = 'next';
  pageEnterAnimation:
    'next' | 'previous' | null = null;


  constructor(
    public languageService: LanguageService,
    private detailedServicesAdminService: DetailedServicesAdminService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private pageLoadingService: PageLoadingService
  ) {}


  ngOnInit(): void {
    this.langSub =
      this.languageService.currentLanguage$.subscribe(lang => {

        this.currentLanguage = lang;

        this.cdr.detectChanges();

      });


    
    this.loadServices();
  }


  loadServices(): void {

    this.pageLoadingService.setServicesLoaded(false);

    const apiSub =
      this.detailedServicesAdminService.getAll().subscribe({

        next: (data: DetailedServiceResponseDto[]) => {

          this.services = data || [];
          this.currentPage = 0;
          this.pageLoadingService.setServicesLoaded(true);
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(
            'Failed to load services:',
            err
          );
          this.pageLoadingService.setServicesLoaded(true);

          this.cdr.detectChanges();
        }

      });

    this.subs.push(apiSub);
  }

  get totalPages(): number {
    if (!this.services.length) {
      return 0;
    }

    return Math.ceil(
      this.services.length /
      this.servicesPerPage
    );
  }


  get pages(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, index) => index
    );
  }


  get visibleServices(): DetailedServiceResponseDto[] {

    const startIndex =
      this.currentPage *
      this.servicesPerPage;

    const endIndex =
      startIndex +
      this.servicesPerPage;

    return this.services.slice(
      startIndex,
      endIndex
    );
  }

  nextPage(): void {

    if (
      this.currentPage >= this.totalPages - 1 ||
      this.isPageChanging
    ) {
      return;
    }

    this.pageDirection = 'next';
    this.animatePageChange(() => {
      this.currentPage++;

    });
  }


  previousPage(): void {
    if (
      this.currentPage <= 0 ||
      this.isPageChanging
    ) {
      return;
    }

    this.pageDirection = 'previous';
    this.animatePageChange(() => {
      this.currentPage--;

    });
  }


  goToPage(page: number): void {
    if (
      page < 0 ||
      page >= this.totalPages ||
      page === this.currentPage ||
      this.isPageChanging
    ) {
      return;
    }

    this.pageDirection =
      page > this.currentPage
        ? 'next'
        : 'previous';

    this.animatePageChange(() => {
      this.currentPage = page;

    });
  }


  private animatePageChange(
    changePage: () => void
  ): void {
    this.isPageChanging = true;
    this.pageEnterAnimation = null;
    this.cdr.detectChanges();

    setTimeout(() => {
      changePage();
      this.isPageChanging = false;
      this.pageEnterAnimation =
        this.pageDirection;
      this.cdr.detectChanges();


      
      setTimeout(() => {
        this.pageEnterAnimation = null;
        this.cdr.detectChanges();
      }, 450);

    }, 220);
  }


  t(key: string): string {

    return this.languageService.translate(key);
  }


  getTranslation<T extends { languageCode: string }>(
    translations: T[] | undefined
  ): T | undefined {

    if (
      !translations ||
      translations.length === 0
    ) {
      return undefined;
    }

    return (
      translations.find(
        t =>
          t.languageCode.toLowerCase() ===
          this.currentLanguage.toLowerCase()
      )
      || translations[0]
    );
  }


  gotoOffer(): void {

    this.router.navigate(['/offer']);

  }

  ngOnDestroy(): void {

    if (this.langSub) {
      this.langSub.unsubscribe();
    }

    this.subs.forEach(
      sub => sub?.unsubscribe()
    );
  }
}