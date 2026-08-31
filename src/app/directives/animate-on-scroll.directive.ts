import { Directive, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAnimateOnScroll]',
  standalone: true
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Add base hidden class
    this.renderer.addClass(this.el.nativeElement, 'scroll-reveal');

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add visible class when scrolling INTO view
          this.renderer.addClass(this.el.nativeElement, 'is-visible');
        } else {
          // Remove visible class when scrolling OUT of view
          this.renderer.removeClass(this.el.nativeElement, 'is-visible');
        }
      },
      { 
        threshold: 0.15 // Triggers when 15% of the element enters/exits view
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}