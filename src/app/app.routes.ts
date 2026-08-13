import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/landing/pages/landing-page/landing-page.component';
import { BaseLayoutComponent } from './layout/base/base-layout/base-layout.component';
import { MatStepperIntl } from '@angular/material/stepper';

export const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: LandingPageComponent
      },
      {
    path: 'booking',
    loadComponent: () => import('./features/bookings/booking-wizard/booking-wizard.component').then(m => m.BookingWizardComponent),
    providers: [
      MatStepperIntl // Fixes lazy-loaded MatStepper NullInjectorError
    ]
  }
    ]
  },
  { path: '**', redirectTo: '' }
];