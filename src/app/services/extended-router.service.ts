import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class ExtendedRouterService {
  private previousUrl?: string;
  private currentUrl?: string;
  private browserRefresh?: boolean;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

    router.events.pipe(untilDestroyed(this)).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.browserRefresh = !router.navigated;
      }

      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  public getPreviousUrl(): string | undefined {
    return this.previousUrl;
  }

  public getCurrentUrl(): string | undefined {
    return this.currentUrl;
  }

  public isBrowserRefresh(): boolean {
    return this.browserRefresh ?? false;
  }

  public isSameUrlNavigation(): boolean {
    return this.getPreviousUrl() === this.getCurrentUrl() || this.isBrowserRefresh();
  }
}
