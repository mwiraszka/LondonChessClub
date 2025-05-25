import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from '@app/components/footer/footer.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { NavigationBarComponent } from '@app/components/navigation-bar/navigation-bar.component';
import { ToasterComponent } from '@app/components/toaster/toaster.component';
import { UpcomingEventBannerComponent } from '@app/components/upcoming-event-banner/upcoming-event-banner.component';
import { Event, IsoDate, Toast } from '@app/models';
import { LoaderService } from '@app/services';
import { AppActions, AppSelectors } from '@app/store/app';
import { EventsSelectors } from '@app/store/events';
import { NotificationsSelectors } from '@app/store/notifications';
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
  public viewModel$?: Observable<{
    bannerLastCleared: IsoDate | null;
    isDarkMode: boolean;
    nextEvent: Event | null;
    showUpcomingEventBanner: boolean;
    toasts: Toast[];
  }>;

  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    public readonly loaderService: LoaderService,
    private readonly router: Router,
    private readonly store: Store,
  ) {
    moment.tz.setDefault('America/Toronto');
  }

  ngOnInit(): void {
    this.initNavigationListenerForScrollingBackToTop();
    this.clearStaleLocalStorageData();

    this.viewModel$ = combineLatest([
      this.store.select(AppSelectors.selectIsDarkMode),
      this.store.select(AppSelectors.selectShowUpcomingEventBanner),
      this.store.select(AppSelectors.selectBannerLastCleared),
      this.store.select(EventsSelectors.selectNextEvent),
      this.store.select(NotificationsSelectors.selectToasts),
    ]).pipe(
      untilDestroyed(this),
      map(
        ([
          isDarkMode,
          showUpcomingEventBanner,
          bannerLastCleared,
          nextEvent,
          toasts,
        ]) => ({
          isDarkMode,
          showUpcomingEventBanner,
          bannerLastCleared,
          nextEvent,
          toasts,
        }),
      ),
      tap(({ isDarkMode, bannerLastCleared }) => {
        this._document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

        if (
          isDefined(bannerLastCleared) &&
          moment().diff(bannerLastCleared, 'days') > 0
        ) {
          this.store.dispatch(AppActions.upcomingEventBannerReinstated());
        }
      }),
    );
  }

  public onClearBanner(): void {
    this.store.dispatch(AppActions.upcomingEventBannerCleared());
  }

  private initNavigationListenerForScrollingBackToTop(): void {
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter(event => event instanceof NavigationEnd && !event.url.split('#')[1]),
      )
      .subscribe(() => {
        const mainElement = this._document.querySelector('main');
        if (mainElement) {
          mainElement.scrollTo({ top: 0 });
        }
      });
  }

  private clearStaleLocalStorageData(): void {
    const oldKeys = ['articles', 'auth', 'members', 'nav', 'schedule', 'user-settings'];
    oldKeys.forEach(key => localStorage.removeItem(key));

    const entityKeys = ['articlesState', 'eventsState', 'membersState'];
    entityKeys.forEach(key => {
      const storedValue = localStorage.getItem(key);
      if (storedValue && JSON.parse(storedValue).controlMode) {
        localStorage.removeItem(key);
      }
    });
  }
}
