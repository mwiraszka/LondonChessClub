import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '@app/components/footer/footer.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { NavigationBarComponent } from '@app/components/navigation-bar/navigation-bar.component';
import { UpcomingEventBannerComponent } from '@app/components/upcoming-event-banner/upcoming-event-banner.component';
import { Event, IsoDate } from '@app/models';
import {
  RefreshService,
  RoutingService,
  TouchEventsService,
  UserActivityService,
} from '@app/services';
import { AppActions, AppSelectors } from '@app/store/app';
import { EventsSelectors } from '@app/store/events';

@UntilDestroy()
@Component({
  selector: 'app-root',
  template: `
    @if (viewModel$ | async; as vm) {
      @if (vm.isLoading) {
        <div class="lcc-loader"><div></div></div>
      }

      @if (vm.showUpcomingEventBanner && vm.nextEvents.length) {
        <lcc-upcoming-event-banner
          [nextEvents]="vm.nextEvents"
          (clearBanner)="onClearBanner()">
        </lcc-upcoming-event-banner>
      }

      <lcc-header></lcc-header>

      <lcc-navigation-bar></lcc-navigation-bar>

      <main
        #mainElement
        cdkScrollable>
        <router-outlet></router-outlet>
        <lcc-footer></lcc-footer>
      </main>
    }
  `,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('mainElement', { read: ElementRef })
  public mainElement!: ElementRef<HTMLElement>;

  public viewModel$?: Observable<{
    bannerLastCleared: IsoDate | null;
    isDarkMode: boolean;
    isDesktopView: boolean;
    isWideView: boolean;
    isLoading: boolean;
    nextEvents: Event[];
    showUpcomingEventBanner: boolean;
  }>;

  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    private readonly refreshService: RefreshService,
    private readonly routingService: RoutingService,
    private readonly store: Store,
    private readonly touchEventsService: TouchEventsService,
    private readonly userActivityService: UserActivityService,
  ) {
    moment.tz.setDefault('America/Toronto');
  }

  public ngOnInit(): void {
    this.touchEventsService.listenForTouchEvents();
    this.userActivityService.monitorSessionExpiry();
    this.initRefreshListener();

    this.viewModel$ = combineLatest([
      this.store.select(AppSelectors.selectBannerLastCleared),
      this.store.select(AppSelectors.selectIsDarkMode),
      this.store.select(AppSelectors.selectIsDesktopView),
      this.store.select(AppSelectors.selectIsWideView),
      this.store.select(AppSelectors.selectIsLoading),
      this.store.select(EventsSelectors.selectConcurrentNextEvents),
      this.store.select(AppSelectors.selectShowUpcomingEventBanner),
    ]).pipe(
      untilDestroyed(this),
      map(
        ([
          bannerLastCleared,
          isDarkMode,
          isDesktopView,
          isWideView,
          isLoading,
          nextEvents,
          showUpcomingEventBanner,
        ]) => ({
          bannerLastCleared,
          isDarkMode,
          isDesktopView,
          isWideView,
          isLoading,
          nextEvents,
          showUpcomingEventBanner,
        }),
      ),
      tap(({ isDarkMode }) => {
        this._document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
      }),
    );

    this.store
      .select(AppSelectors.selectIsDesktopView)
      .pipe(untilDestroyed(this))
      .subscribe(isDesktopView => {
        this.updateViewportForDesktopView(isDesktopView);
      });

    this.store
      .select(AppSelectors.selectIsWideView)
      .pipe(untilDestroyed(this))
      .subscribe(isWideView => {
        this._document.body.setAttribute('data-wide-view', isWideView ? 'true' : 'false');
      });
  }

  public ngAfterViewInit(): void {
    this.refreshService.initialize(this.mainElement.nativeElement);
    this.initNavigationListenerForScrollingBackToTop();
  }

  public onClearBanner(): void {
    this.store.dispatch(AppActions.upcomingEventBannerCleared());
  }

  private initRefreshListener(): void {
    this.refreshService.isRefreshing$
      .pipe(
        untilDestroyed(this),
        filter(isRefreshing => isRefreshing),
      )
      .subscribe(() => {
        this.store.dispatch(AppActions.refreshAppRequested());
      });

    this.store
      .select(AppSelectors.selectIsLoading)
      .pipe(
        untilDestroyed(this),
        filter(isLoading => !isLoading && this.refreshService.isRefreshing$.value),
      )
      .subscribe(() => {
        this.refreshService.completeRefresh();
      });
  }

  private initNavigationListenerForScrollingBackToTop(): void {
    this.routingService.fragment$
      .pipe(
        untilDestroyed(this),
        filter(fragment => !fragment),
      )
      .subscribe(() => this.mainElement.nativeElement.scrollTo({ top: 0 }));
  }

  private updateViewportForDesktopView(isDesktopView: boolean): void {
    const viewport = this._document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      return;
    }

    if (isDesktopView) {
      const targetWidth = 1200;
      const scale = window.innerWidth / targetWidth;
      viewport.setAttribute(
        'content',
        `width=${targetWidth}, initial-scale=${scale}, minimum-scale=${scale}, maximum-scale=3.0, user-scalable=yes`,
      );
    } else {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
  }
}
