import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';
import { Subscription } from 'rxjs';

import { ReviewAdminService } from '../../../../services/admin/review-admin.service';
import { LanguageService } from '../../../../services/language.service';
import { ReviewResponseDto } from '../../../../models/admin.dto';
import { PageLoadingService } from '../../../../services/page-loading.service';

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
  private langSub!: Subscription;

  currentLanguage: string = 'en';
  reviews: ReviewResponseDto[] = [];


  currentPage: number = 0;
  readonly reviewsPerPage: number = 3;


  isPageChanging = false;
  pageDirection: 'next' | 'previous' = 'next';
  pageEnterAnimation: 'next' | 'previous' | null = null;

  constructor(
    public languageService: LanguageService,
    private cdr: ChangeDetectorRef,
    private reviewAdminService: ReviewAdminService,
    private pageLoadingService: PageLoadingService
  ) { }

  ngOnInit(): void {

    this.langSub =
      this.languageService.currentLanguage$.subscribe(lang => {
        this.currentLanguage = lang;

        this.cdr.detectChanges();
      });

    this.getAllReviews();
  }

  t(key: string): string {
    return this.languageService.translate(key);
  }

  getAllReviews(): void {
    this.pageLoadingService.setTestimonialsLoaded(false);
    const sub = this.reviewAdminService.getAll().subscribe({
      next: (response: any) => {
        this.reviews = response || [];
        this.currentPage = 0;
        this.pageLoadingService.setTestimonialsLoaded(true);
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Failed to load reviews:', err);
        this.pageLoadingService.setTestimonialsLoaded(true);
        this.cdr.detectChanges();
      }

    });

    this.subs.push(sub);
  }


  get totalPages(): number {
    if (!this.reviews.length) {
      return 0;
    }
    return Math.ceil(
      this.reviews.length / this.reviewsPerPage
    );
  }

  get pages(): number[] {
    return Array.from(
      { length: this.totalPages },
      (_, index) => index
    );
  }

  get visibleReviews(): ReviewResponseDto[] {
    const startIndex =
      this.currentPage * this.reviewsPerPage;
    const endIndex =
      startIndex + this.reviewsPerPage;
    return this.reviews.slice(
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
      this.pageEnterAnimation = this.pageDirection;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.pageEnterAnimation = null;
        this.cdr.detectChanges();

      }, 450);

    }, 220);
  }

  getTranslation<T extends { languageCode: string }>(
    translations: T[]
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


  ngOnDestroy(): void {

    if (this.langSub) {
      this.langSub.unsubscribe();
    }

    this.subs.forEach(
      sub => sub?.unsubscribe()
    );
  }
}