import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageLoadingService {

  private heroLoaded = new BehaviorSubject<boolean>(false);
  private howItWorksLoaded = new BehaviorSubject<boolean>(false);
  private servicesLoaded = new BehaviorSubject<boolean>(false);
  private pricingLoaded = new BehaviorSubject<boolean>(false);
  private testimonialsLoaded = new BehaviorSubject<boolean>(false);

  readonly pageLoading$ = combineLatest([
    this.heroLoaded,
    this.howItWorksLoaded,
    this.servicesLoaded,
    this.pricingLoaded,
    this.testimonialsLoaded
  ]).pipe(
    map(states => states.some(loaded => !loaded))
  );

  setHeroLoaded(value: boolean): void {
    this.heroLoaded.next(value);
  }

  setHowItWorksLoaded(value: boolean): void {
    this.howItWorksLoaded.next(value);
  }

  setServicesLoaded(value: boolean): void {
    this.servicesLoaded.next(value);
  }

  setPricingLoaded(value: boolean): void {
    this.pricingLoaded.next(value);
  }

  setTestimonialsLoaded(value: boolean): void {
    this.testimonialsLoaded.next(value);
  }
}