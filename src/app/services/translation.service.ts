// services/translation.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SupportedLanguage = 'en' | 'fi';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<SupportedLanguage>('en');
  currentLang$ = this.currentLangSubject.asObservable();

  // Flexible dictionary structure - group by feature/section
  private dictionary: Record<SupportedLanguage, Record<string, string>> = {
    en: {
      'pricing.badge': 'TRANSPARENT RATES',
      'pricing.title_main': 'Affordable Pricing',
      'pricing.title_highlight': 'Packages',
      'pricing.subheading': 'No hidden fees. Choose the level of service that best fits your move.',
      'pricing.popular_badge': 'MOST POPULAR',
      'pricing.book_package': 'Book This Package',

      'nav.home': 'Home',
      'nav.pricing': 'Pricing',
      'nav.booking': 'Book Now',
      
      'common.arrow_right': '→'
    },
    fi: {
      'pricing.badge': 'LÄPINÄKYVÄT HINNAT',
      'pricing.title_main': 'Edulliset Muutto',
      'pricing.title_highlight': 'Paketit',
      'pricing.subheading': 'Ei piilokuluja. Valitse muuttoosi parhaiten sopiva palvelutaso.',
      'pricing.popular_badge': 'SUOSITUIN',
      'pricing.book_package': 'Varaa Tämä Paketti',

      'nav.home': 'Etusivu',
      'nav.pricing': 'Hinnasto',
      'nav.booking': 'Varaa Nyt',

      'common.arrow_right': '→'
    }
  };

  setLanguage(lang: string): void {
    const formatted = lang.toLowerCase() as SupportedLanguage;
    if (formatted === 'en' || formatted === 'fi') {
      this.currentLangSubject.next(formatted);
    }
  }

  get currentLanguage(): SupportedLanguage {
    return this.currentLangSubject.getValue();
  }

  // Core translate logic with fallback return
  translate(key: string): string {
    const lang = this.currentLanguage;
    return this.dictionary[lang]?.[key] || this.dictionary['en']?.[key] || key;
  }
}