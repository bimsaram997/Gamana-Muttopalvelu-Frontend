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
      // Common UI
      'common.next': 'Next',
      'common.back': 'Back',

      // Booking Wizard
      'booking.title': 'Book Your Move',
      'booking.subtitle': 'Get an instant estimate and confirm your booking in a few easy steps.',
      'booking.steps.service': 'Service & Package',
      'booking.steps.addresses': 'Addresses',
      'booking.steps.contact': 'Schedule & Contact',

      // Step 1: Package Section
      'booking.packageSection.title': 'Select Moving Package',
      'booking.packageSection.subtitle': 'Choose the package that best fits your moving requirements.',
      'booking.packageSection.select': 'Select Package',
      'booking.packageSection.estimatedHours': 'Estimated Hours',
      'booking.packageSection.includeCleaning': 'Include Move-out Cleaning',
      'booking.summary.estimatedTotal': 'Estimated Total',
      'booking.summary.totalPrice': 'Total Price',

      // Step 2: Address Section
      'booking.addressSection.title': 'Locations & Details',
      'booking.addressSection.pickup': 'Pickup Location',
      'booking.addressSection.dropoff': 'Dropoff Location',
      'booking.addressSection.searchAddress': 'Search address...',
      'booking.addressSection.floor': 'Floor',
      'booking.addressSection.hasElevator': 'Elevator Available',
      'booking.addressSection.addPickup': 'Add Another Pickup Location',
      'booking.addressSection.notes': 'Additional Notes / Instructions',

      // Step 3: Contact & Schedule Section
      'booking.contactSection.title': 'Schedule & Contact Information',
      'booking.contactSection.moveDate': 'Move Date',
      'booking.contactSection.moveTime': 'Preferred Time',
      'booking.contactSection.fullName': 'Full Name',
      'booking.contactSection.email': 'Email Address',
      'booking.contactSection.phone': 'Phone Number',
      'booking.contactSection.confirmBooking': 'Confirm Booking',

      // Confirmation Page & Map
      'booking.confirmation.title': 'Booking Confirmed!',
      'booking.confirmation.subtitle': 'Thank you for choosing us. We have received your booking request.',
      'booking.confirmation.id': 'Booking Reference ID',
      'booking.confirmation.routeMap': 'Optimized Route Overview',
      'booking.confirmation.loadingMap': 'Loading route map...',
      'booking.confirmation.summary': 'Booking Summary',
      'booking.map.office': 'Office',

      // Pricing
      'pricing.badge': 'TRANSPARENT RATES',
      'pricing.title_main': 'Affordable Pricing',
      'pricing.title_highlight': 'Packages',
      'pricing.subheading': 'No hidden fees. Choose the level of service that best fits your move in Tampere and surrounding areas.',
      'pricing.popular_badge': 'MOST POPULAR',
      'pricing.book_package': 'Book This Package',

      // Hero
      'hero.tagline': 'BOOK ONLINE 24/7 • YOUR BELONGINGS, OUR RESPONSIBILITY',
      'hero.title_main': 'The moving experts in',
      'hero.title_city': 'Tampere',
      'hero.description': 'Professional moving service starting at just 25€ per hour. Fast, reliable, and stress-free handling for your home or business.',
      'hero.our_services': 'Our Services',
      'hero.book_now': 'Book now',
      'hero.request_offer': 'Request an offer',

      // How it works
      'howItWorks.badge': 'SIMPLE PROCESS',
      'howItWorks.title_main': 'How It',
      'howItWorks.title_highlight': 'Works',
      'howItWorks.subheading': 'Relocating or transferring furniture in Tampere is quick and transparent in three simple steps.',
      'howItWorks.cta_button': 'Book Your Move Now',

      // Service
      'services.badge': 'WHAT WE DO',
      'services.title_main': 'Our Moving & Transport',
      'services.title_highlight': 'Services',
      'services.subheading': 'Tailored moving, transport, and cleaning solutions designed to make your move completely hassle-free.',
      'services.custom_question': 'Need a custom transport arrangement?',
      'services.get_price_btn': 'Get Instant Price',

      // Reviews
      'reviews.badge': 'CUSTOMER REVIEWS',
      'reviews.title_main': 'Trusted by Movers in',
      'reviews.title_highlight': 'Tampere',
      'reviews.google_reviews_suffix': 'Google Reviews',

      // Header
      'header.topbar_location': 'The moving experts in Tampere',
      'header.topbar_reviews': 'Google Reviews',
      'header.brand_subtitle': 'MUUTTOPALVELU',
      'header.brand_tagline': 'Your belongings • Our responsibility',
      'header.nav_about': 'About us',
      'header.nav_services': 'Services',
      'header.nav_pricing': 'Pricing',
      'header.nav_contact': 'Contact',
      'header.book_online': 'Book Online',

      // Footer
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
      'footer.pricing_note': 'Starting at 25€/h in Tampere.',

      'booking.confirmation.customer': 'Customer',
      'booking.confirmation.status': 'Status',
      'booking.confirmation.optimizedRouteCalculations': 'Optimized Route Calculations',
      'booking.confirmation.totalDistance': 'Total Distance',
      'booking.confirmation.estDrivingTime': 'Est. Driving Time',
      'booking.confirmation.optimalPath': 'Optimal Path',
      'booking.confirmation.deliveryPoint': 'Delivery Point',
      'booking.confirmation.pickup': 'Pickup',
      'booking.confirmation.addressUnavailable': 'Address N/A',
      'booking.confirmation.mins': 'mins',

      //offer
      // Offer Request Wizard
      'wizard.pageTitle': 'Request an Offer',
      'wizard.successTitle': 'Offer Request Sent!',
      'wizard.successDescription': 'Thank you for contacting us! We have received your request and will get back to you with a personalized quote as soon as possible.',
      'wizard.goHome': 'Return to Home',
      'wizard.step1Label': 'Contact & Date',
      'wizard.step1Heading': 'Contact Details & Moving Date',
      'wizard.fullName': 'Full Name',
      'wizard.email': 'Email Address',
      'wizard.phone': 'Phone Number',
      'wizard.moveDate': 'Moving Date',
      'wizard.nextDeparture': 'Next: Departure Details',
      'wizard.step2Label': 'Departure',
      'wizard.step2Heading': 'Departure Location',
      'wizard.departureAddress': 'Departure Address',
      'wizard.city': 'City',
      'wizard.postalCode': 'Postal Code',
      'wizard.apartmentArea': 'Apartment Area (m²)',
      'wizard.floor': 'Floor',
      'wizard.elevator': 'Elevator available',
      'wizard.back': 'Back',
      'wizard.nextDestination': 'Next: Destination Details',
      'wizard.step3Label': 'Destination',
      'wizard.step3Heading': 'Destination Location',
      'wizard.destinationAddress': 'Destination Address',
      'wizard.nextAdditionalInfo': 'Next: Additional Services',
      'wizard.step4Label': 'Services & Consent',
      'wizard.step4Heading': 'Additional Services & Notes',
      'wizard.servicesLabel': 'Additional Services Required',
      'wizard.additionalInfoLabel': 'Additional Information / Special Instructions',
      'wizard.privacyPolicyConsent': 'I agree to the privacy policy and consent to being contacted regarding this offer.',
      'wizard.sendRequest': 'Send Offer Request',
      'wizard.sendingRequest': 'Sending Request...',
    },
    fi: {
      // Yleiset
      'common.next': 'Seuraava',
      'common.back': 'Takaisin',

      // Muuttovaraus
      'booking.title': 'Varaa Muutto',
      'booking.subtitle': 'Hanki välitön hinta-arvio ja vahvista varauksesi muutamassa helpossa vaiheessa.',
      'booking.steps.service': 'Palvelu & Paketti',
      'booking.steps.addresses': 'Osoitteet',
      'booking.steps.contact': 'Aikataulu & Yhteystiedot',

      // Vaihe 1: Pakettiosio
      'booking.packageSection.title': 'Valitse Muuttopaketti',
      'booking.packageSection.subtitle': 'Valitse tarpeisiisi parhaiten sopiva muuttopaketti.',
      'booking.packageSection.select': 'Valitse Paketti',
      'booking.packageSection.estimatedHours': 'Arvioitu Tuntimäärä',
      'booking.packageSection.includeCleaning': 'Sisällytä Muuttosiivous',
      'booking.summary.estimatedTotal': 'Arvioitu Yhteensä',
      'booking.summary.totalPrice': 'Kokonaishinta',

      // Vaihe 2: Osoiteosio
      'booking.addressSection.title': 'Osoitteet & Tiedot',
      'booking.addressSection.pickup': 'Nouto-osoite',
      'booking.addressSection.dropoff': 'Määränpää',
      'booking.addressSection.searchAddress': 'Hae osoitetta...',
      'booking.addressSection.floor': 'Kerros',
      'booking.addressSection.hasElevator': 'Hissi Käytettävissä',
      'booking.addressSection.addPickup': 'Lisää Toinen Nouto-osoite',
      'booking.addressSection.notes': 'Lisätiedot / Ohjeet',

      // Vaihe 3: Yhteystiedot & Aikataulu
      'booking.contactSection.title': 'Aikataulu & Yhteystiedot',
      'booking.contactSection.moveDate': 'Muuttopäivä',
      'booking.contactSection.moveTime': 'Toivottu Aika',
      'booking.contactSection.fullName': 'Koko Nimi',
      'booking.contactSection.email': 'Sähköpostiosoite',
      'booking.contactSection.phone': 'Puhelinnumero',
      'booking.contactSection.confirmBooking': 'Vahvista Varaus',

      // Vahvistussivu & Kartta
      'booking.confirmation.title': 'Varaus Vahvistettu!',
      'booking.confirmation.subtitle': 'Kiitos että valitsit meidät. Olemme vastaanottaneet varauspyyntösi.',
      'booking.confirmation.id': 'Varausnumero',
      'booking.confirmation.routeMap': 'Optimoitu Reittikartta',
      'booking.confirmation.loadingMap': 'Ladataan reittikarttaa...',
      'booking.confirmation.summary': 'Varauksen Yhteenveto',
      'booking.map.office': 'Toimisto',

      // Hinnasto
      'pricing.badge': 'LÄPINÄKYVÄT HINNAT',
      'pricing.title_main': 'Edulliset Muutto',
      'pricing.title_highlight': 'Paketit',
      'pricing.subheading': 'Ei piilokuluja. Valitse muuttoosi parhaiten sopiva palvelutaso Tampereella ja lähialueilla.',
      'pricing.popular_badge': 'SUOSITUIN',
      'pricing.book_package': 'Varaa Tämä Paketti',

      // Hero
      'hero.tagline': 'VARAA VERKOSSA 24/7 • OMAISUUTESI, VASTUUMME',
      'hero.title_main': 'Muuttopalvelun asiantuntijat alueella',
      'hero.title_city': 'Tampere',
      'hero.description': 'Ammattimainen muutto alkaen vain 25€/tunti. Nopeaa, luotettavaa ja vaivatonta palvelua kodillesi tai yrityksellesi.',
      'hero.our_services': 'Palvelumme',
      'hero.book_now': 'Varaa nyt',
      'hero.request_offer': 'Pyydä tarjous',

      // How it works
      'howItWorks.badge': 'YKSINKERTAINEN PROSESSI',
      'howItWorks.title_main': 'Kuinka Se',
      'howItWorks.title_highlight': 'Toimii',
      'howItWorks.subheading': 'Muutto tai huonekalujen kuljetus Tampereella on nopeaa ja läpinäkyvää kolmessa yksinkertaisessa vaiheessa.',
      'howItWorks.cta_button': 'Varaa Muuttosi Nyt',

      // Service
      'services.badge': 'MITÄ TEEMME',
      'services.title_main': 'Muutto- ja Kuljetus',
      'services.title_highlight': 'Palvelumme',
      'services.subheading': 'Räätälöidyt muutto-, kuljetus- ja siivouspalvelut, jotka tekevät muutostasi täysin vaivattoman.',
      'services.custom_question': 'Tarvitsetko räätälöidyn kuljetusratkaisun?',
      'services.get_price_btn': 'Hae Hinta Heti',

      // Reviews
      'reviews.badge': 'ASIAKASARVOSTELUT',
      'reviews.title_main': 'Asiakkaidemme luottama',
      'reviews.title_highlight': 'Tampereella',
      'reviews.google_reviews_suffix': 'Google-arvostelua',

      // Header
      'header.topbar_location': 'Muuttoasiantuntijat Tampereella',
      'header.topbar_reviews': 'Google-arvostelua',
      'header.brand_subtitle': 'MUUTTOPALVELU',
      'header.brand_tagline': 'Tavarasi • Meidän vastuullamme',
      'header.nav_about': 'Meistä',
      'header.nav_services': 'Palvelut',
      'header.nav_pricing': 'Hinnasto',
      'header.nav_contact': 'Ota yhteyttä',
      'header.book_online': 'Varaa verkossa',

      // Footer
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
      'footer.pricing_note': 'Alkaen 25€/h Tampereella.',

      'booking.confirmation.customer': 'Asiakas',
      'booking.confirmation.status': 'Tila',
      'booking.confirmation.optimizedRouteCalculations': 'Optimoidun Reitin Laskelmat',
      'booking.confirmation.totalDistance': 'Konaismatka',
      'booking.confirmation.estDrivingTime': 'Arvioitu Ajoaika',
      'booking.confirmation.optimalPath': 'Optimaalinen Reitti',
      'booking.confirmation.deliveryPoint': 'Määränpää',
      'booking.confirmation.pickup': 'Nouto',
      'booking.confirmation.addressUnavailable': 'Osoite Ei Saatavilla',
      'booking.confirmation.mins': 'min',

      //offer
      'wizard.pageTitle': 'Pyydä Tarjous',
      'wizard.successTitle': 'Tarjouspyyntö Lähetetty!',
      'wizard.successDescription': 'Kiitos yhteydenotostasi! Olemme vastaanottaneet pyyntösi ja palaamme asiaan yksilöidyn tarjouksen kanssa mahdollisimman pian.',
      'wizard.goHome': 'Palaa Kotisivulle',
      'wizard.step1Label': 'Yhteystiedot & Päivä',
      'wizard.step1Heading': 'Yhteystiedot & Muuttopäivä',
      'wizard.fullName': 'Koko Nimi',
      'wizard.email': 'Sähköpostiosoite',
      'wizard.phone': 'Puhelinnumero',
      'wizard.moveDate': 'Muuttopäivämäärä',
      'wizard.nextDeparture': 'Seuraava: Lähtöosoite',
      'wizard.step2Label': 'Lähtöosoite',
      'wizard.step2Heading': 'Lähtöpaikan Tiedot',
      'wizard.departureAddress': 'Lähtöosoite',
      'wizard.city': 'Kaupunki',
      'wizard.postalCode': 'Postinumero',
      'wizard.apartmentArea': 'Asunnon Pinta-ala (m²)',
      'wizard.floor': 'Kerros',
      'wizard.elevator': 'Hissi käytettävissä',
      'wizard.back': 'Takaisin',
      'wizard.nextDestination': 'Seuraava: Määränpää',
      'wizard.step3Label': 'Määränpää',
      'wizard.step3Heading': 'Määränpään Tiedot',
      'wizard.destinationAddress': 'Määränpään Osoite',
      'wizard.nextAdditionalInfo': 'Seuraava: Lisäpalvelut',
      'wizard.step4Label': 'Lisäpalvelut & Suostumus',
      'wizard.step4Heading': 'Lisäpalvelut & Lisätiedot',
      'wizard.servicesLabel': 'Valitse Tarvittavat Lisäpalvelut',
      'wizard.additionalInfoLabel': 'Lisätiedot / Erityisohjeet',
      'wizard.privacyPolicyConsent': 'Hyväksyn tietosuojaselosteen ja annan luvan ottaa minuun yhteyttä tätä tarjousta koskien.',
      'wizard.sendRequest': 'Lähetä Tarjouspyyntö',
      'wizard.sendingRequest': 'Lähetetään Pyyntöä...',
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