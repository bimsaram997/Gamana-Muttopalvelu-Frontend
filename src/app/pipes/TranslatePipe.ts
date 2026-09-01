// pipes/translate.pipe.ts
import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Pure: false ensures template re-renders on language stream emissions
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription!: Subscription;
  private lastKey: string = '';
  private lastValue: string = '';

  constructor(
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    this.subscription = this.translationService.currentLang$.subscribe(() => {
      if (this.lastKey) {
        this.lastValue = this.translationService.translate(this.lastKey);
        this.cdr.markForCheck();
      }
    });
  }

  transform(key: string): string {
    this.lastKey = key;
    this.lastValue = this.translationService.translate(key);
    return this.lastValue;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}