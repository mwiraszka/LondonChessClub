import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { filter } from 'rxjs/operators';

import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from '@app/components/footer/footer.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { NavigationBarComponent } from '@app/components/navigation-bar/navigation-bar.component';
import { ToasterComponent } from '@app/components/toaster/toaster.component';
import { UpcomingEventBannerComponent } from '@app/components/upcoming-event-banner/upcoming-event-banner.component';
import { LoaderService } from '@app/services';
import { AppActions, AppSelectors } from '@app/store/app';
import { isDefined } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CdkScrollableModule,
    CommonModule,
    FooterComponent,
    HeaderComponent,
    NavigationBarComponent,
    RouterOutlet,
    ToasterComponent,
    UpcomingEventBannerComponent,
  ],
})
export class AppComponent implements OnInit {
  public readonly appViewModel$ = this.store.select(AppSelectors.selectAppViewModel);

  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    public readonly loaderService: LoaderService,
    private readonly router: Router,
    private readonly store: Store,
  ) {
    moment.tz.setDefault('America/Toronto');
  }

  ngOnInit(): void {
    this.initAppViewModel();
    this.initNavigationListenerForScrollingBackToTop();
    this.clearOldLocalStorageKeys();
  }

  public onClearBanner(): void {
    this.store.dispatch(AppActions.upcomingEventBannerCleared());
  }

  private initAppViewModel(): void {
    this.appViewModel$
      .pipe(untilDestroyed(this))
      .subscribe(({ isDarkMode, bannerLastCleared }) => {
        this._document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

        if (
          isDefined(bannerLastCleared) &&
          moment().diff(bannerLastCleared, 'days') > 0
        ) {
          this.store.dispatch(AppActions.upcomingEventBannerReinstated());
        }
      });
  }

  private initNavigationListenerForScrollingBackToTop(): void {
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter(event => event instanceof NavigationEnd && !event.url.split('#')[1]),
      )
      .subscribe(() => this._document.querySelector('main')!.scrollTo({ top: 0 }));
  }

  private clearOldLocalStorageKeys(): void {
    const oldKeys = ['articles', 'auth', 'members', 'nav', 'schedule', 'user-settings'];
    oldKeys.forEach(key => localStorage.removeItem(key));
  }
}
