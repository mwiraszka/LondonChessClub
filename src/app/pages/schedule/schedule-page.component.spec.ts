import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom, take } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MOCK_EVENTS } from '@app/mocks/events.mock';
import { MetaAndTitleService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { EventsActions, EventsSelectors } from '@app/store/events';
import { query } from '@app/utils';

import { SchedulePageComponent } from './schedule-page.component';

describe('SchedulePageComponent', () => {
  let fixture: ComponentFixture<SchedulePageComponent>;
  let component: SchedulePageComponent;

  let metaAndTitleService: MetaAndTitleService;
  let store: MockStore;

  let dispatchSpy: jest.SpyInstance;
  let getElementByIdSpy: jest.SpyInstance;
  let scrollSpy: jest.SpyInstance;
  let updateDescriptionSpy: jest.SpyInstance;
  let updateTitleSpy: jest.SpyInstance;

  const mockEvents = MOCK_EVENTS.slice(0, 5);
  const mockIsAdmin = true;
  const mockNextEvent = MOCK_EVENTS[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulePageComponent],
      providers: [
        {
          provide: MetaAndTitleService,
          useValue: {
            updateTitle: jest.fn(),
            updateDescription: jest.fn(),
          },
        },
        provideMockStore(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SchedulePageComponent);
    component = fixture.componentInstance;

    metaAndTitleService = TestBed.inject(MetaAndTitleService);
    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, 'dispatch');
    getElementByIdSpy = jest.spyOn(document, 'getElementById').mockImplementation();
    scrollSpy = jest.spyOn(window, 'scroll').mockImplementation();
    updateDescriptionSpy = jest.spyOn(metaAndTitleService, 'updateDescription');
    updateTitleSpy = jest.spyOn(metaAndTitleService, 'updateTitle');

    store.overrideSelector(EventsSelectors.selectAllEvents, mockEvents);
    store.overrideSelector(AuthSelectors.selectIsAdmin, mockIsAdmin);
    store.refreshState();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should set meta title and description', () => {
      expect(updateTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTitleSpy).toHaveBeenCalledWith('Schedule');
      expect(updateDescriptionSpy).toHaveBeenCalledTimes(1);
    });

    it('should set viewModel$ with expected data', async () => {
      const vm = await firstValueFrom(component.viewModel$!.pipe(take(1)));

      expect(vm).toStrictEqual({
        events: mockEvents,
        isAdmin: mockIsAdmin,
        nextEvent: mockNextEvent,
        showPastEvents: mockShowPastEvents,
        upcomingEvents: mockUpcomingEvents,
      });
    });

    describe('scroll behavior', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      it('should scroll to next event when upcoming events exist', async () => {
        const mockElement = {
          scrollIntoView: jest.fn(),
        };
        getElementByIdSpy.mockReturnValue(mockElement as unknown as HTMLElement);

        await firstValueFrom(component.viewModel$!.pipe(take(1)));
        jest.advanceTimersByTime(150);

        expect(getElementByIdSpy).toHaveBeenCalledTimes(1);
        expect(getElementByIdSpy).toHaveBeenCalledWith(mockUpcomingEvents[0].id);
        expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      });

      it('should not scroll when element is not found', async () => {
        getElementByIdSpy.mockReturnValue(null);

        await firstValueFrom(component.viewModel$!.pipe(take(1)));
        jest.advanceTimersByTime(150);

        expect(getElementByIdSpy).toHaveBeenCalledWith(mockUpcomingEvents[0].id);
      });

      it('should not scroll when no upcoming events', async () => {
        store.overrideSelector(EventsSelectors.selectUpcomingEvents, []);
        store.refreshState();

        await firstValueFrom(component.viewModel$!.pipe(take(1)));
        jest.advanceTimersByTime(150);

        expect(getElementByIdSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('onRequestDeleteEvent', () => {
    it('should dispatch deleteEventRequested action', () => {
      const event = mockEvents[0];
      component.onRequestDeleteEvent(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        EventsActions.deleteEventRequested({ event }),
      );
    });
  });

  describe('onTogglePastEvents', () => {
    it('should scroll to top and dispatch pastEventsToggled action', () => {
      component.onTogglePastEvents();

      expect(scrollSpy).toHaveBeenCalledTimes(1);
      expect(scrollSpy).toHaveBeenCalledWith({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(EventsActions.pastEventsToggled());
    });
  });

  describe('template rendering', () => {
    describe('when viewModel$ is undefined', () => {
      it('should not render any content', () => {
        expect(query(fixture.debugElement, 'lcc-page-header')).toBeFalsy();
        expect(query(fixture.debugElement, 'lcc-schedule')).toBeFalsy();
      });
    });

    describe('when viewModel$ is defined', () => {
      it('should render page header and schedule component', () => {
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-page-header')).toBeTruthy();
        expect(query(fixture.debugElement, 'lcc-schedule')).toBeTruthy();
      });
    });
  });
});
