import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router,
  RouterOutlet
} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  isRouteEntering = false;

  private routerSub!: Subscription;
  private enterTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.routerSub = this.router.events.subscribe(event => {

      // Only animate AFTER Angular has finished navigation
      if (event instanceof NavigationEnd) {
        this.startEnterAnimation();
      }

      // Make sure animation is reset if navigation fails
      if (
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.resetTransition();
      }
    });
  }

  private startEnterAnimation(): void {
    clearTimeout(this.enterTimer);

    // Reset first
    this.isRouteEntering = false;
    this.cdr.detectChanges();

    // Start animation on the newly loaded route
    requestAnimationFrame(() => {
      this.isRouteEntering = true;
      this.cdr.detectChanges();

      this.enterTimer = setTimeout(() => {
        this.isRouteEntering = false;
        this.cdr.detectChanges();
      }, 350);
    });
  }

  private resetTransition(): void {
    clearTimeout(this.enterTimer);

    this.isRouteEntering = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    clearTimeout(this.enterTimer);
  }
}