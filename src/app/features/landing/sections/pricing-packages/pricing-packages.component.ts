
import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

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
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './pricing-packages.component.html',
  styleUrl: './pricing-packages.component.css'
})
export class PricingPackagesComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  private langSub!: Subscription;

  packages: PackageResponseDto[] = [];

  currentLanguage: string = 'en';
  currentPage: number = 0;

  readonly packagesPerPage: number = 3;
  isPageChanging = false;
  pageDirection: 'next' | 'previous' = 'next';

  constructor(
    private router: Router,
    private packageAdminService: PackageAdminService,
    public languageService: LanguageService,
    private cdr: ChangeDetectorRef,
    private pageLoadingService: PageLoadingService
  ) { }


  ngOnInit(): void {


    this.langSub =
      this.languageService.currentLanguage$.subscribe(lang => {

        this.currentLanguage = lang;

        this.cdr.detectChanges();

      });



    this.getAllPackages();
  }




  t(key: string): string {
    return this.languageService.translate(key);
  }


  getTranslation<T extends { languageCode: string }>(
    translations: T[]
  ): T | undefined {

    if (!translations || translations.length === 0) {
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




  getAllPackages(): void {

    this.pageLoadingService.setPricingLoaded(false);

    const sub =
      this.packageAdminService.getAll().subscribe({

        next: (response: any) => {

          this.packages = response || [];

          
          
          this.currentPage = 0;

          this.pageLoadingService.setPricingLoaded(true);

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(
            'Failed to load packages:',
            err
          );

          
          
          this.pageLoadingService.setPricingLoaded(true);

          this.cdr.detectChanges();
        }

      });

    this.subs.push(sub);
  }




  get totalPages(): number {

    if (!this.packages.length) {
      return 0;
    }

    return Math.ceil(
      this.packages.length / this.packagesPerPage
    );
  }


  get pages(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, index) => index
    );
  }


  get visiblePackages(): PackageResponseDto[] {

    const startIndex =
      this.currentPage * this.packagesPerPage;

    const endIndex =
      startIndex + this.packagesPerPage;

    return this.packages.slice(
      startIndex,
      endIndex
    );
  }




  nextPage(): void {

    if (this.currentPage >= this.totalPages - 1 || this.isPageChanging) {
      return;
    }

    this.pageDirection = 'next';
    this.animatePageChange(() => {
      this.currentPage++;
    });
  }




  previousPage(): void {
    if (this.currentPage <= 0 || this.isPageChanging) {
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
    page > this.currentPage ? 'next' : 'previous';

  this.animatePageChange(() => {
    this.currentPage = page;
  });
}


  private animatePageChange(
    changePage: () => void
  ): void {

    this.isPageChanging = true;

   
    this.cdr.detectChanges();

    setTimeout(() => {

      changePage();

     
      this.cdr.detectChanges();

     
      setTimeout(() => {
        this.isPageChanging = false;
        this.cdr.detectChanges();
      }, 50);

    }, 220);
  }

  private scrollToPricing(): void {

    setTimeout(() => {

      const element =
        document.getElementById('pricing');

      if (!element) {
        return;
      }

      const headerOffset = 80;

      const elementPosition =
        element.getBoundingClientRect().top +
        window.pageYOffset;

      const offsetPosition =
        elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

    }, 50);
  }




  selectPackageAndBook(
    packageId: number
  ): void {

    this.router.navigate(
      ['/booking'],
      {
        queryParams: {
          packageId: packageId
        }
      }
    );
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

