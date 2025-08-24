import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FooterComponent } from '@app/components/footer/footer.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { NavigationBarComponent } from '@app/components/navigation-bar/navigation-bar.component';
import { UpcomingEventBannerComponent } from '@app/components/upcoming-event-banner/upcoming-event-banner.component';
import { MOCK_EVENTS } from '@app/mocks/events.mock';
import { RoutingService, TouchEventsService, UrlExpirationService } from '@app/services';
import { AppActions, AppSelectors } from '@app/store/app';
import { EventsSelectors } from '@app/store/events';
import { query } from '@app/utils';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let store: MockStore;
  let touchEventsService: TouchEventsService;
  let urlExpirationService: UrlExpirationService;

  let dispatchSpy: jest.SpyInstance;
  let querySelectorSpy: jest.SpyInstance;
  let setAttributeSpy: jest.SpyInstance;

  const mockState = {
    appCallState: 'idle' as const,
    bannerLastCleared: null,
    isDarkMode: false,
    nextEvent: MOCK_EVENTS[0],
    showUpcomingEventBanner: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        FooterComponent,
        HeaderComponent,
        NavigationBarComponent,
        UpcomingEventBannerComponent,
      ],
      providers: [
        provideMockStore(),
        provideRouter([]),
        {
          provide: RoutingService,
          useValue: { fragment$: of(null) },
        },
        {
          provide: UrlExpirationService,
          useValue: { listenForImageChanges: jest.fn() },
        },
        {
          provide: TouchEventsService,
          useValue: { listenForTouchEvents: jest.fn() },
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;

        store = TestBed.inject(MockStore);
        touchEventsService = TestBed.inject(TouchEventsService);
        urlExpirationService = TestBed.inject(UrlExpirationService);

        store.overrideSelector(AppSelectors.selectAppCallState, mockState.appCallState);
        store.overrideSelector(AppSelectors.selectIsDarkMode, mockState.isDarkMode);
        store.overrideSelector(
          AppSelectors.selectShowUpcomingEventBanner,
          mockState.showUpcomingEventBanner,
        );
        store.overrideSelector(
          AppSelectors.selectBannerLastCleared,
          mockState.bannerLastCleared,
        );
        store.overrideSelector(EventsSelectors.selectNextEvent, mockState.nextEvent);

        dispatchSpy = jest.spyOn(store, 'dispatch');
        querySelectorSpy = jest.spyOn(document, 'querySelector');
        setAttributeSpy = jest.spyOn(document.body, 'setAttribute');
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize services', () => {
      component.ngOnInit();

      expect(urlExpirationService.listenForImageChanges).toHaveBeenCalled();
      expect(touchEventsService.listenForTouchEvents).toHaveBeenCalled();
    });

    it('should set viewModel$ observable', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.viewModel$).toBeDefined();
      component.viewModel$?.subscribe(vm => {
        expect(vm).toEqual({
          isDarkMode: mockState.isDarkMode,
          showUpcomingEventBanner: mockState.showUpcomingEventBanner,
          bannerLastCleared: mockState.bannerLastCleared,
          nextEvent: mockState.nextEvent,
        });
      });
    });

    it('should set data-theme attribute to light when isDarkMode is false', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', 'light');
    });

    it('should set data-theme attribute to dark when isDarkMode is true', () => {
      const setAttributeSpy = jest.spyOn(document.body, 'setAttribute');
      store.overrideSelector(AppSelectors.selectIsDarkMode, true);

      component.ngOnInit();
      fixture.detectChanges();

      expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('should reinstate banner when last cleared more than a day ago', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      store.overrideSelector(
        AppSelectors.selectBannerLastCleared,
        twoDaysAgo.toISOString(),
      );

      component.ngOnInit();
      fixture.detectChanges();

      expect(dispatchSpy).toHaveBeenCalledWith(
        AppActions.upcomingEventBannerReinstated(),
      );
    });

    it('should not reinstate banner when last cleared today', () => {
      const today = new Date().toISOString();
      store.overrideSelector(AppSelectors.selectBannerLastCleared, today);

      component.ngOnInit();
      fixture.detectChanges();

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        AppActions.upcomingEventBannerReinstated(),
      );
    });

    it('should not reinstate banner when bannerLastCleared is null', () => {
      store.overrideSelector(AppSelectors.selectBannerLastCleared, null);

      component.ngOnInit();
      fixture.detectChanges();

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        AppActions.upcomingEventBannerReinstated(),
      );
    });

    it('should initialize navigation listener for scrolling', () => {
      component.ngOnInit();

      expect(querySelectorSpy).toHaveBeenCalledWith('main');
    });

    it('should scroll to top when navigation occurs without fragment', () => {
      const mainElement = {
        scrollTo: jest.fn(),
      };
      jest
        .spyOn(document, 'querySelector')
        .mockReturnValue(mainElement as unknown as HTMLElement);

      component.ngOnInit();
      fixture.detectChanges();

      expect(mainElement.scrollTo).toHaveBeenCalledWith({ top: 0 });
    });
  });

  describe('onClearBanner', () => {
    it('should dispatch upcomingEventBannerCleared action', () => {
      component.onClearBanner();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.upcomingEventBannerCleared());
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render header component', () => {
      expect(query(fixture.debugElement, 'lcc-header')).toBeTruthy();
    });

    it('should render navigation bar component', () => {
      expect(query(fixture.debugElement, 'lcc-navigation-bar')).toBeTruthy();
    });

    it('should render main element with cdkScrollable directive', () => {
      expect(query(fixture.debugElement, 'main[cdkScrollable]')).toBeTruthy();
    });

    it('should render router outlet', () => {
      expect(query(fixture.debugElement, 'router-outlet')).toBeTruthy();
    });

    it('should render footer component', () => {
      expect(query(fixture.debugElement, 'lcc-footer')).toBeTruthy();
    });

    describe('loader', () => {
      it('should render loader when appCallState is loading', () => {
        store.overrideSelector(AppSelectors.selectAppCallState, 'loading');

        component.ngOnInit();
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.lcc-loader')).toBeTruthy();
      });

      it('should not render loader when appCallState is idle', () => {
        store.overrideSelector(AppSelectors.selectAppCallState, 'idle');

        component.ngOnInit();
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.lcc-loader')).toBeFalsy();
      });

      it('should not render loader when appCallState is error', () => {
        store.overrideSelector(AppSelectors.selectAppCallState, 'error');

        component.ngOnInit();
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.lcc-loader')).toBeFalsy();
      });
    });

    describe('upcoming event banner', () => {
      it('should render banner when showUpcomingEventBanner is true and nextEvent exists', () => {
        store.overrideSelector(AppSelectors.selectShowUpcomingEventBanner, true);
        store.overrideSelector(EventsSelectors.selectNextEvent, MOCK_EVENTS[0]);

        component.ngOnInit();
        fixture.detectChanges();

        expect(
          query(fixture.debugElement, 'lcc-upcoming-event-banner').componentInstance
            .nextEvent,
        ).toEqual(MOCK_EVENTS[0]);
      });

      it('should not render banner when showUpcomingEventBanner is false', () => {
        store.overrideSelector(AppSelectors.selectShowUpcomingEventBanner, false);
        store.overrideSelector(EventsSelectors.selectNextEvent, MOCK_EVENTS[0]);

        component.ngOnInit();
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-upcoming-event-banner')).toBeFalsy();
      });

      it('should not render banner when nextEvent is null', () => {
        store.overrideSelector(AppSelectors.selectShowUpcomingEventBanner, true);
        store.overrideSelector(EventsSelectors.selectNextEvent, null);

        component.ngOnInit();
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-upcoming-event-banner')).toBeFalsy();
      });

      it('should handle clearBanner event from banner component', () => {
        store.overrideSelector(AppSelectors.selectShowUpcomingEventBanner, true);
        store.overrideSelector(EventsSelectors.selectNextEvent, MOCK_EVENTS[0]);

        component.ngOnInit();
        fixture.detectChanges();

        query(fixture.debugElement, 'lcc-upcoming-event-banner').triggerEventHandler(
          'clearBanner',
        );

        expect(dispatchSpy).toHaveBeenCalledWith(AppActions.upcomingEventBannerCleared());
      });
    });
  });
});
