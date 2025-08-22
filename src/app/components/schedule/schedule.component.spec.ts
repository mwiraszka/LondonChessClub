import { MockStore, provideMockStore } from '@ngrx/store/testing';
import moment from 'moment-timezone';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminToolbarComponent } from '@app/components/admin-toolbar/admin-toolbar.component';
import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { MOCK_EVENTS } from '@app/mocks/events.mock';
import { DialogService } from '@app/services';
import { EventsActions, EventsSelectors } from '@app/store/events';
import { query, queryAll, queryTextContent } from '@app/utils';

import { ScheduleComponent } from './schedule.component';

describe('ScheduleComponent', () => {
  let fixture: ComponentFixture<ScheduleComponent>;
  let component: ScheduleComponent;

  let dialogService: DialogService;
  let store: MockStore;

  let dialogOpenSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  let onTogglePastEventsSpy: jest.SpyInstance;
  let windowScrollSpy: jest.SpyInstance;

  const mockPastEvents = [MOCK_EVENTS[0], MOCK_EVENTS[1]];
  const mockUpcomingEvents = [MOCK_EVENTS[2], MOCK_EVENTS[3], MOCK_EVENTS[4]];
  const mockNextEvent = mockUpcomingEvents[0];

  beforeEach(() => {
    windowScrollSpy = jest.spyOn(window, 'scroll').mockImplementation();

    TestBed.configureTestingModule({
      imports: [AdminControlsDirective, AdminToolbarComponent, ScheduleComponent],
      providers: [
        provideMockStore(),
        provideRouter([]),
        { provide: DialogService, useValue: { open: jest.fn() } },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ScheduleComponent);
        component = fixture.componentInstance;

        store = TestBed.inject(MockStore);
        dialogService = TestBed.inject(DialogService);

        dialogOpenSpy = jest.spyOn(dialogService, 'open');
        dispatchSpy = jest.spyOn(store, 'dispatch');
        onTogglePastEventsSpy = jest.spyOn(component, 'onTogglePastEvents');

        component.events = [...mockPastEvents, ...mockUpcomingEvents];
        component.upcomingEvents = mockUpcomingEvents;
        component.nextEvent = mockNextEvent;
        component.isAdmin = false;
        component.showPastEvents = false;
        component.allowTogglePastEvents = true;
        component.includeDetails = true;
        fixture.detectChanges();
      });
  });

  afterEach(() => {
    windowScrollSpy.mockRestore();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization and fetching events', () => {
    it('should dispatch fetchEventsRequested when last fetch was more than 10 minutes ago', () => {
      const elevenMinutesAgo = moment().subtract(11, 'minutes').toISOString();
      store.overrideSelector(EventsSelectors.selectLastFetch, elevenMinutesAgo);

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(EventsActions.fetchEventsRequested());
    });

    it('should dispatch fetchEventsRequested when lastFetch is null', () => {
      store.overrideSelector(EventsSelectors.selectLastFetch, null);

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(EventsActions.fetchEventsRequested());
    });

    it('should not dispatch fetchEventsRequested when last fetch was less than 10 minutes ago', () => {
      const nineMinutesAgo = moment().subtract(9, 'minutes').toISOString();
      dispatchSpy.mockClear();
      store.overrideSelector(EventsSelectors.selectLastFetch, nineMinutesAgo);

      component.ngOnInit();

      expect(dispatchSpy).not.toHaveBeenCalledWith(EventsActions.fetchEventsRequested());
    });
  });

  describe('getAdminControlsConfig', () => {
    it('should return correct configuration for an event', () => {
      const event = MOCK_EVENTS[0];
      const config = component.getAdminControlsConfig(event);

      expect(config.buttonSize).toBe(34);
      expect(config.editPath).toEqual(['event', 'edit', event.id]);
      expect(config.itemName).toBe(event.title);
      expect(config.deleteCb).toBeDefined();
    });
  });

  describe('onDeleteEvent', () => {
    const mockEvent = MOCK_EVENTS[0];

    it('should open confirmation dialog with correct parameters', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');
      await component.onDeleteEvent(mockEvent);

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Delete ${mockEvent.title}?`,
            confirmButtonText: 'Delete',
            confirmButtonType: 'warning',
          },
        },
        isModal: true,
      });
    });

    it('should dispatch deleteEventRequested when user confirms', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      await component.onDeleteEvent(mockEvent);

      expect(dispatchSpy).toHaveBeenCalledWith(
        EventsActions.deleteEventRequested({ event: mockEvent }),
      );
    });

    it('should not dispatch deleteEventRequested when user cancels', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');
      await component.onDeleteEvent(mockEvent);

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        EventsActions.deleteEventRequested({ event: mockEvent }),
      );
    });
  });

  describe('onTogglePastEvents', () => {
    it('should dispatch pastEventsToggled action', () => {
      component.onTogglePastEvents();

      expect(dispatchSpy).toHaveBeenCalledWith(EventsActions.pastEventsToggled());
    });

    it('should scroll window to top smoothly', () => {
      component.onTogglePastEvents();

      expect(windowScrollSpy).toHaveBeenCalledWith({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    describe('admin toolbar', () => {
      it('should render admin toolbar with correct links when isAdmin is true', () => {
        component.isAdmin = true;
        fixture.detectChanges();

        expect(
          query(fixture.debugElement, 'lcc-admin-toolbar').componentInstance.adminLinks,
        ).toEqual([component.addEventLink]);
      });

      it('should not render admin toolbar when isAdmin is false', () => {
        component.isAdmin = false;
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-admin-toolbar')).toBeFalsy();
      });
    });

    describe('events table', () => {
      it('should render table with correct headers', () => {
        expect(query(fixture.debugElement, 'table.lcc-table')).toBeTruthy();

        const headers = queryAll(fixture.debugElement, 'th');
        expect(headers.length).toBe(2);
        expect(headers[0].nativeElement.textContent.trim()).toBe('Date');
        expect(headers[1].nativeElement.textContent.trim()).toBe('Event');
      });

      it('should show only upcoming events when showPastEvents is false', () => {
        component.showPastEvents = false;
        fixture.detectChanges();

        expect(queryAll(fixture.debugElement, 'tbody tr').length).toBe(
          mockUpcomingEvents.length,
        );
      });

      it('should show all events when showPastEvents is true', () => {
        component.showPastEvents = true;
        fixture.detectChanges();

        expect(queryAll(fixture.debugElement, 'tbody tr').length).toBe(
          component.events.length,
        );
      });

      it('should limit upcoming events when upcomingEventLimit is set', () => {
        component.showPastEvents = false;
        component.upcomingEventLimit = 2;
        fixture.detectChanges();

        expect(queryAll(fixture.debugElement, 'tbody tr').length).toBe(2);
      });

      it('should highlight next event row', () => {
        expect(
          query(fixture.debugElement, `tr#${mockNextEvent.id}`).classes['next-event'],
        ).toBe(true);
      });

      it('should apply showing-past-events class when showing past events', () => {
        component.showPastEvents = true;
        fixture.detectChanges();

        queryAll(fixture.debugElement, 'tbody tr').forEach(row => {
          expect(row.classes['showing-past-events']).toBe(true);
        });
      });

      it('should display event dates', () => {
        expect(queryTextContent(fixture.debugElement, '.date-cell .date')).toBe(
          'Friday, April 22nd 2050',
        );
      });

      it('should display event titles', () => {
        const titleElements = queryAll(fixture.debugElement, '.title');
        expect(titleElements.length).toBeGreaterThan(0);
        expect(titleElements[0].nativeElement.textContent.trim()).toBe(
          mockUpcomingEvents[0].title,
        );
      });

      it('should display event types with correct styling', () => {
        expect(query(fixture.debugElement, '.type-container').classes['lecture']).toBe(
          true,
        );

        expect(queryTextContent(fixture.debugElement, '.type')).toBe('lecture');
      });

      it('should display championship icon for championship events', () => {
        component.upcomingEvents = [MOCK_EVENTS[1]]; // Championship event
        fixture.detectChanges();

        expect(queryTextContent(fixture.debugElement, '.championship-icon')).toBe(
          'emoji_events',
        );
      });

      it('should display event details when includeDetails is true', () => {
        component.includeDetails = true;
        fixture.detectChanges();

        expect(queryTextContent(fixture.debugElement, '.event-details')).toContain(
          mockUpcomingEvents[0].details,
        );
      });

      it('should not display event details when includeDetails is false', () => {
        component.includeDetails = false;
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.event-details')).toBeFalsy();
      });

      it('should display article link when event has articleId', () => {
        const eventWithArticle = mockUpcomingEvents.find(
          event => event.articleId !== null,
        );
        component.upcomingEvents = [eventWithArticle!];
        fixture.detectChanges();

        const articleLink = query(fixture.debugElement, '.event-article');
        expect(articleLink.nativeElement.getAttribute('href')).toBe(
          '/article/view/' + eventWithArticle!.articleId,
        );
        expect(articleLink.nativeElement.textContent.trim()).toBe('More details');
      });

      it('should not display article link when event has no articleId', () => {
        const eventWithoutArticle = mockUpcomingEvents.find(
          event => event.articleId === null,
        );
        component.upcomingEvents = [eventWithoutArticle!];
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.event-article')).toBeFalsy();
      });

      it('should display modification info when includeDetails and isAdmin are true', () => {
        component.includeDetails = true;
        component.isAdmin = true;
        fixture.detectChanges();

        const modInfoText = queryTextContent(fixture.debugElement, '.created-and-edited');
        expect(modInfoText).toContain('Event created');
        expect(modInfoText).toContain('Last edited');
      });

      it('should not display modification info when isAdmin is false', () => {
        component.includeDetails = true;
        component.isAdmin = false;
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.created-and-edited')).toBeFalsy();
      });

      it('should show admin controls on rows when isAdmin is true', () => {
        component.isAdmin = true;
        fixture.detectChanges();

        const row = query(fixture.debugElement, 'tbody tr');
        const adminControlsValue = row.componentInstance?.getAdminControlsConfig(
          component.events[0],
        );
        expect(adminControlsValue).toBeTruthy();
      });
    });

    describe('toggle past events button', () => {
      it('should render toggle button when allowTogglePastEvents is true', () => {
        component.allowTogglePastEvents = true;
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.toggle-past-events-button')).toBeTruthy();
      });

      it('should not render toggle button when allowTogglePastEvents is false', () => {
        component.allowTogglePastEvents = false;
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.toggle-past-events-button')).toBeFalsy();
      });

      it('should display "Show past events" when showPastEvents is false', () => {
        component.showPastEvents = false;
        fixture.detectChanges();

        expect(queryTextContent(fixture.debugElement, '.toggle-past-events-button')).toBe(
          'Show past events',
        );
      });

      it('should display "Hide past events" when showPastEvents is true', () => {
        component.showPastEvents = true;
        fixture.detectChanges();

        expect(queryTextContent(fixture.debugElement, '.toggle-past-events-button')).toBe(
          'Hide past events',
        );
      });

      it('should call onTogglePastEvents when clicked', () => {
        query(fixture.debugElement, '.toggle-past-events-button').triggerEventHandler(
          'click',
        );

        expect(onTogglePastEventsSpy).toHaveBeenCalled();
      });
    });
  });
});
