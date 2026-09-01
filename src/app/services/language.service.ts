// services/language.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SupportedLanguage = 'en' | 'fi';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<SupportedLanguage>('en');
  currentLanguage$ = this.currentLangSubject.asObservable();

  // Dictionary for hardcoded UI text
  private translations: Record<SupportedLanguage, Record<string, string>> = {
    en: {
      'pricing.badge': 'TRANSPARENT RATES',
      'pricing.title_main': 'Affordable Pricing',
      'pricing.title_highlight': 'Packages',
      'pricing.subheading': 'No hidden fees. Choose the level of service that best fits your move in Tampere and surrounding areas.',
      'pricing.popular_badge': 'MOST POPULAR',
      'pricing.book_package': 'Book This Package',
      //Here
      'hero.tagline': 'BOOK ONLINE 24/7 • YOUR BELONGINGS, OUR RESPONSIBILITY',
      'hero.title_main': 'The moving experts in',
      'hero.title_city': 'Tampere',
      'hero.description': 'Professional moving service starting at just 25€ per hour. Fast, reliable, and stress-free handling for your home or business.',
      'hero.our_services': 'Our Services',
      'hero.book_now': 'Book now',
      'hero.request_offer': 'Request an offer',

      //How it works
      'howItWorks.badge': 'SIMPLE PROCESS',
      'howItWorks.title_main': 'How It',
      'howItWorks.title_highlight': 'Works',
      'howItWorks.subheading': 'Relocating or transferring furniture in Tampere is quick and transparent in three simple steps.',
      'howItWorks.cta_button': 'Book Your Move Now',

      //Service
      'services.badge': 'WHAT WE DO',
      'services.title_main': 'Our Moving & Transport',
      'services.title_highlight': 'Services',
      'services.subheading': 'Tailored moving, transport, and cleaning solutions designed to make your move completely hassle-free.',
      'services.custom_question': 'Need a custom transport arrangement?',
      'services.get_price_btn': 'Get Instant Price',

      //reviews
      'reviews.badge': 'CUSTOMER REVIEWS',
      'reviews.title_main': 'Trusted by Movers in',
      'reviews.title_highlight': 'Tampere',
      'reviews.google_reviews_suffix': 'Google Reviews',

      //header
      'header.topbar_location': 'The moving experts in Tampere',
      'header.topbar_reviews': 'Google Reviews',
      'header.brand_subtitle': 'MUUTTOPALVELU',
      'header.brand_tagline': 'Your belongings • Our responsibility',
      'header.nav_about': 'About us',
      'header.nav_services': 'Services',
      'header.nav_pricing': 'Pricing',
      'header.nav_contact': 'Contact',
      'header.book_online': 'Book Online',

      //footer
      'footer.brand_subtitle': 'MUUTTOPALVELU • TAMPERE',
      'footer.mission_text': 'Professional, reliable, and affordable moving services across Tampere and Finland. Your belongings, our responsibility.',
      'footer.services_title': 'Services',
      'footer.service_apartment': 'Apartment Move',
      'footer.service_store_pickup': 'Store Pickups',
      'footer.service_city_transfer': 'City Transfers',
      'footer.service_cleaning': 'Move-out Cleaning',
      'footer.area_title': 'Service Area',
      'footer.area_tampere': 'Tampere & Central Region',
      'footer.area_suburbs1': 'Hervanta, Pirkkala, Lempäälä',
      'footer.area_suburbs2': 'Nokia, Ylöjärvi, Kangasala',
      'footer.area_nationwide': 'Nationwide Intercity Delivery',
      'footer.contact_title': 'Contact Us',
      'footer.working_hours': 'Mon – Sun: 08:00 – 20:00',
      'footer.location': 'Tampere, Finland',
      'footer.all_rights_reserved': 'All rights reserved.',
      'footer.pricing_note': 'Starting at 25€/h in Tampere.'
    },
    fi: {
      'pricing.badge': 'LÄPINÄKYVÄT HINNAT',
      'pricing.title_main': 'Edulliset Muutto',
      'pricing.title_highlight': 'Paketit',
      'pricing.subheading': 'Ei piilokuluja. Valitse muuttoosi parhaiten sopiva palvelutaso Tampereella ja lähialueilla.',
      'pricing.popular_badge': 'SUOSITUIN',
      'pricing.book_package': 'Varaa Tämä Paketti',
      //Hero
      'hero.tagline': 'VARAA VERKOSSA 24/7 • OMAISUUTESI, VASTUUMME',
      'hero.title_main': 'Muuttopalvelun asiantuntijat alueella',
      'hero.title_city': 'Tampere',
      'hero.description': 'Ammattimainen muutto alkaen vain 25€/tunti. Nopeaa, luotettavaa ja vaivatonta palvelua kodillesi tai yrityksellesi.',
      'hero.our_services': 'Palvelumme',
      'hero.book_now': 'Varaa nyt',
      'hero.request_offer': 'Pyydä tarjous',
      //How it works
      'howItWorks.badge': 'YKSINKERTAINEN PROSESSI',
      'howItWorks.title_main': 'Kuinka Se',
      'howItWorks.title_highlight': 'Toimii',
      'howItWorks.subheading': 'Muutto tai huonekalujen kuljetus Tampereella on nopeaa ja läpinäkyvää kolmessa yksinkertaisessa vaiheessa.',
      'howItWorks.cta_button': 'Varaa Muuttosi Nyt',

      //Service
      'services.badge': 'MITÄ TEEMME',
      'services.title_main': 'Muutto- ja Kuljetus',
      'services.title_highlight': 'Palvelumme',
      'services.subheading': 'Räätälöidyt muutto-, kuljetus- ja siivouspalvelut, jotka tekevät muutostasi täysin vaivattoman.',
      'services.custom_question': 'Tarvitsetko räätälöidyn kuljetusratkaisun?',
      'services.get_price_btn': 'Hae Hinta Heti',

      //reviews
      'reviews.badge': 'ASIAKASARVOSTELUT',
      'reviews.title_main': 'Asiakkaidemme luottama',
      'reviews.title_highlight': 'Tampereella',
      'reviews.google_reviews_suffix': 'Google-arvostelua',

      //header
      'header.topbar_location': 'Muuttoasiantuntijat Tampereella',
      'header.topbar_reviews': 'Google-arvostelua',
      'header.brand_subtitle': 'MUUTTOPALVELU',
      'header.brand_tagline': 'Tavarasi • Meidän vastuullamme',
      'header.nav_about': 'Meistä',
      'header.nav_services': 'Palvelut',
      'header.nav_pricing': 'Hinnasto',
      'header.nav_contact': 'Ota yhteyttä',
      'header.book_online': 'Varaa verkossa',

      //footer
      'footer.brand_subtitle': 'MUUTTOPALVELU • TAMPERE',
      'footer.mission_text': 'Ammattimaiset, luotettavat ja edulliset muuttopalvelut Tampereella ja koko Suomessa. Tavarasi, meidän vastuullamme.',
      'footer.services_title': 'Palvelut',
      'footer.service_apartment': 'Asuntomuutto',
      'footer.service_store_pickup': 'Noudot kaupoista',
      'footer.service_city_transfer': 'Kaupunkikuljetukset',
      'footer.service_cleaning': 'Muuttosiivous',
      'footer.area_title': 'Toiminta-alue',
      'footer.area_tampere': 'Tampere ja keskusta-alue',
      'footer.area_suburbs1': 'Hervanta, Pirkkala, Lempäälä',
      'footer.area_suburbs2': 'Nokia, Ylöjärvi, Kangasala',
      'footer.area_nationwide': 'Valtakunnalliset muuttokuljetukset',
      'footer.contact_title': 'Ota yhteyttä',
      'footer.working_hours': 'Ma – Su: 08:00 – 20:00',
      'footer.location': 'Tampere, Suomi',
      'footer.all_rights_reserved': 'Kaikki oikeudet pidätetään.',
      'footer.pricing_note': 'Alkaen 25€/h Tampereella.'
    }
  };

  setLanguage(lang: string): void {
    const formatted = lang.toLowerCase() as SupportedLanguage;
    this.currentLangSubject.next(formatted);
  }

  get currentLanguage(): SupportedLanguage {
    return this.currentLangSubject.getValue();
  }

  translate(key: string): string {
    const lang = this.currentLanguage;
    return this.translations[lang]?.[key] || this.translations['en']?.[key] || key;
  }
}