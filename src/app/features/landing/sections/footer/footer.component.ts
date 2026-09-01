import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MATERIAL_COMPONENTS } from '../../../../utills/material-imports';
import { Subscription } from 'maplibre-gl';
import { LanguageService } from '../../../../services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  phoneNumber = '+358 41 471 4856';
  phoneHref = 'tel:+358414714856';
  whatsappHref = 'https://wa.me/358414714856';
  private langSub!: Subscription;
  constructor(
    public languageService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Re-render template when language changes
    this.langSub = this.languageService.currentLanguage$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  // Translation helper function
  t(key: string): string {
    return this.languageService.translate(key);
  }

  ngOnDestroy(): void {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }
}
