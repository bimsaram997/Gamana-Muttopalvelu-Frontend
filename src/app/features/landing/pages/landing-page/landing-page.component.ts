import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../sections/hero-section/hero-section.component';
import { HowItWorksComponent } from '../../sections/how-it-works/how-it-works.component';
import { ServiceSectionComponent } from '../../sections/service-section/service-section.component';
import { PricingPackagesComponent } from '../../sections/pricing-packages/pricing-packages.component';
import { TestimonialsComponent } from '../../sections/testimonials/testimonials.component';
import { FooterComponent } from '../../sections/footer/footer.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HeroSectionComponent, 
    HowItWorksComponent, 
    ServiceSectionComponent,
    PricingPackagesComponent,
    TestimonialsComponent,
    FooterComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
