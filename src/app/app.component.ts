import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, DOCUMENT, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '@app/components/footer/footer.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { NavigationBarComponent } from '@app/components/navigation-bar/navigation-bar.component';
import { UpcomingEventBannerComponent } from '@app/components/upcoming-event-banner/upcoming-event-banner.component';
import { Event, IsoDate } from '@app/models';
import { LoaderService, RouteFragmentService, UrlExpirationService } from '@app/services';
import { TouchEventsService } from '@app/services';
import { AppActions, AppSelectors } from '@app/store/app';
import { EventsSelectors } from '@app/store/events';
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
    UpcomingEventBannerComponent,
  ],
})
export class AppComponent implements OnInit {
  public viewModel$?: Observable<{
    bannerLastCleared: IsoDate | null;
    isDarkMode: boolean;
    nextEvent: Event | null;
    showUpcomingEventBanner: boolean;
  }>;

  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    public readonly loaderService: LoaderService,
    private readonly store: Store,
    private readonly touchEventsService: TouchEventsService,
    private readonly urlExpirationService: UrlExpirationService,
    private readonly routeFragmentService: RouteFragmentService,
  ) {
    moment.tz.setDefault('America/Toronto');
  }

  ngOnInit(): void {
    this.initNavigationListenerForScrollingBackToTop();
    this.urlExpirationService.listenForImageChanges();
    this.touchEventsService.listenForTouchEvents();

    this.viewModel$ = combineLatest([
      this.store.select(AppSelectors.selectIsDarkMode),
      this.store.select(AppSelectors.selectShowUpcomingEventBanner),
      this.store.select(AppSelectors.selectBannerLastCleared),
      this.store.select(EventsSelectors.selectNextEvent),
    ]).pipe(
      untilDestroyed(this),
      map(([isDarkMode, showUpcomingEventBanner, bannerLastCleared, nextEvent]) => ({
        isDarkMode,
        showUpcomingEventBanner,
        bannerLastCleared,
        nextEvent,
      })),
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
    this.routeFragmentService.fragment$
      .pipe(
        untilDestroyed(this),
        filter(fragment => !fragment),
      )
      .subscribe(() => {
        const mainElement = this._document.querySelector('main');
        if (mainElement) {
          mainElement.scrollTo({ top: 0 });
        }
      });
  }
}
