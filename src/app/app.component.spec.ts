import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subject, firstValueFrom, take } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FooterComponent } from '@app/components/footer/footer.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { NavigationBarComponent } from '@app/components/navigation-bar/navigation-bar.component';
import { UpcomingEventBannerComponent } from '@app/components/upcoming-event-banner/upcoming-event-banner.component';
import { MOCK_EVENTS } from '@app/mocks/events.mock';
import { RoutingService, TouchEventsService } from '@app/services';
import { AppActions, AppSelectors } from '@app/store/app';
import { EventsSelectors } from '@app/store/events';
import { query } from '@app/utils';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let mockFragmentSubject: Subject<string | null>;
  let store: MockStore;
  let touchEventsService: TouchEventsService;

  let dispatchSpy: jest.SpyInstance;
  let querySelectorSpy: jest.SpyInstance;
  let setAttributeSpy: jest.SpyInstance;

  beforeEach(async () => {
    mockFragmentSubject = new Subject<string | null>();

    await TestBed.configureTestingModule({
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
          useValue: { fragment$: mockFragmentSubject.asObservable() },
        },
        {
          provide: TouchEventsService,
          useValue: { listenForTouchEvents: jest.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);
    touchEventsService = TestBed.inject(TouchEventsService);

    dispatchSpy = jest.spyOn(store, 'dispatch');
    querySelectorSpy = jest.spyOn(document, 'querySelector');
    setAttributeSpy = jest.spyOn(document.body, 'setAttribute');

    store.overrideSelector(AppSelectors.selectBannerLastCleared, null);
    store.overrideSelector(AppSelectors.selectIsDarkMode, false);
    store.overrideSelector(AppSelectors.selectIsLoading, false);
    store.overrideSelector(EventsSelectors.selectNextEvent, MOCK_EVENTS[0]);
    store.overrideSelector(AppSelectors.selectShowUpcomingEventBanner, false);
    store.refreshState();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should scroll to top when navigation occurs without fragment', () => {
      const mainElement = {
        scrollTo: jest.fn(),
      };
      querySelectorSpy.mockReturnValue(mainElement as unknown as HTMLElement);

      component.ngOnInit();
      mockFragmentSubject.next(null);
      fixture.detectChanges();

      expect(querySelectorSpy).toHaveBeenCalledWith('main');
      expect(mainElement.scrollTo).toHaveBeenCalledWith({ top: 0 });
    });

    it('should not scroll to top when navigation occurs with fragment', () => {
      const mainElement = {
        scrollTo: jest.fn(),
      };
      querySelectorSpy.mockReturnValue(mainElement as unknown as HTMLElement);

      component.ngOnInit();
      mockFragmentSubject.next('some-fragment');
      fixture.detectChanges();

      expect(querySelectorSpy).not.toHaveBeenCalled();
      expect(mainElement.scrollTo).not.toHaveBeenCalled();
    });

    it('should initialize image change and touch event listeners', () => {
      expect(touchEventsService.listenForTouchEvents).toHaveBeenCalled();
    });

    it('should set viewModel$', async () => {
      const vm = await firstValueFrom(component.viewModel$!.pipe(take(1)));

      expect(vm).toStrictEqual({
        bannerLastCleared: null,
        isDarkMode: false,
        isLoading: false,
        nextEvent: MOCK_EVENTS[0],
        showUpcomingEventBanner: false,
      });
    });

    it('should set data-theme attribute to light when isDarkMode is false', () => {
      expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', 'light');
    });

    it('should set data-theme attribute to dark when isDarkMode is true', () => {
      store.overrideSelector(AppSelectors.selectIsDarkMode, true);
      store.refreshState();

      component.ngOnInit();
      fixture.detectChanges();

      expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', 'dark');
    });
  });

  describe('onClearBanner', () => {
    it('should dispatch upcomingEventBannerCleared action', () => {
      component.onClearBanner();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.upcomingEventBannerCleared());
    });
  });

  describe('template rendering', () => {
    describe('when viewModel$ is undefined', () => {
      it('should not render any page components', () => {
        expect(query(fixture.debugElement, 'lcc-header')).toBeFalsy();
        expect(query(fixture.debugElement, 'lcc-navigation-bar')).toBeFalsy();
        expect(query(fixture.debugElement, 'main[cdkScrollable]')).toBeFalsy();
        expect(query(fixture.debugElement, 'router-outlet')).toBeFalsy();
        expect(query(fixture.debugElement, 'lcc-footer')).toBeFalsy();

        expect(query(fixture.debugElement, '.lcc-loader')).toBeFalsy();
        expect(query(fixture.debugElement, 'lcc-upcoming-event-banner')).toBeFalsy();
      });
    });

    describe('when viewModel$ is defined', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should render all main page components', () => {
        expect(query(fixture.debugElement, 'lcc-header')).toBeTruthy();
        expect(query(fixture.debugElement, 'lcc-navigation-bar')).toBeTruthy();
        expect(query(fixture.debugElement, 'main[cdkScrollable]')).toBeTruthy();
        expect(query(fixture.debugElement, 'router-outlet')).toBeTruthy();
        expect(query(fixture.debugElement, 'lcc-footer')).toBeTruthy();

        expect(query(fixture.debugElement, '.lcc-loader')).toBeFalsy();
        expect(query(fixture.debugElement, 'lcc-upcoming-event-banner')).toBeFalsy();
      });

      it('should render loader when app is loading data', () => {
        store.overrideSelector(AppSelectors.selectIsLoading, true);
        store.refreshState();
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.lcc-loader')).toBeTruthy();
      });

      describe('upcoming event banner', () => {
        it('should render banner when showUpcomingEventBanner is true and nextEvent exists', () => {
          store.overrideSelector(AppSelectors.selectShowUpcomingEventBanner, true);
          store.overrideSelector(EventsSelectors.selectNextEvent, MOCK_EVENTS[0]);
          store.refreshState();
          fixture.detectChanges();

          expect(
            query(fixture.debugElement, 'lcc-upcoming-event-banner').componentInstance
              .nextEvent,
          ).toEqual(MOCK_EVENTS[0]);
        });

        it('should not render banner when showUpcomingEventBanner is false', () => {
          store.overrideSelector(AppSelectors.selectShowUpcomingEventBanner, false);
          store.overrideSelector(EventsSelectors.selectNextEvent, MOCK_EVENTS[0]);
          store.refreshState();
          fixture.detectChanges();

          expect(query(fixture.debugElement, 'lcc-upcoming-event-banner')).toBeFalsy();
        });

        it('should not render banner when nextEvent is null', () => {
          store.overrideSelector(AppSelectors.selectShowUpcomingEventBanner, true);
          store.overrideSelector(EventsSelectors.selectNextEvent, null);
          store.refreshState();
          fixture.detectChanges();

          expect(query(fixture.debugElement, 'lcc-upcoming-event-banner')).toBeFalsy();
        });

        it('should handle clearBanner event from banner component', () => {
          store.overrideSelector(AppSelectors.selectShowUpcomingEventBanner, true);
          store.overrideSelector(EventsSelectors.selectNextEvent, MOCK_EVENTS[0]);
          store.refreshState();
          fixture.detectChanges();

          query(fixture.debugElement, 'lcc-upcoming-event-banner').triggerEventHandler(
            'clearBanner',
          );

          expect(dispatchSpy).toHaveBeenCalledTimes(1);
          expect(dispatchSpy).toHaveBeenCalledWith(
            AppActions.upcomingEventBannerCleared(),
          );
        });
      });
    });
  });
});
