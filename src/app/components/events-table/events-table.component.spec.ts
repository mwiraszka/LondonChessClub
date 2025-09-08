import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminToolbarComponent } from '@app/components/admin-toolbar/admin-toolbar.component';
import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { MOCK_EVENTS } from '@app/mocks/events.mock';
import { DialogService } from '@app/services';
import { query, queryAll, queryTextContent } from '@app/utils';

import { EventsTableComponent } from './events-table.component';

describe('EventsTableComponent', () => {
  let fixture: ComponentFixture<EventsTableComponent>;
  let component: EventsTableComponent;

  let dialogService: DialogService;

  let dialogOpenSpy: jest.SpyInstance;
  let requestDeleteEventSpy: jest.SpyInstance;

  const mockEvents = MOCK_EVENTS.slice(0, 3);
  const mockIsAdmin = true;
  const mockNextEvent = mockEvents[1];
  const mockOptions = {
    page: 1,
    pageSize: 10,
    sortBy: 'eventDate',
    sortOrder: 'asc',
    filters: {
      showPastEvents: {
        label: 'Show past events',
        value: false,
      },
    },
    search: '',
  };
  const showModificationInfo = true;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminControlsDirective, AdminToolbarComponent, EventsTableComponent],
      providers: [
        {
          provide: DialogService,
          useValue: { open: jest.fn() },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsTableComponent);
    component = fixture.componentInstance;

    dialogService = TestBed.inject(DialogService);

    dialogOpenSpy = jest.spyOn(dialogService, 'open');
    requestDeleteEventSpy = jest.spyOn(component.requestDeleteEvent, 'emit');

    fixture.componentRef.setInput('events', mockEvents);
    fixture.componentRef.setInput('isAdmin', mockIsAdmin);
    fixture.componentRef.setInput('nextEvent', mockNextEvent);
    fixture.componentRef.setInput('options', mockOptions);
    fixture.componentRef.setInput('showModificationInfo', showModificationInfo);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAdminControlsConfig', () => {
    it('should return correct configuration for an event', () => {
      const event = mockEvents[0];
      const config = component.getAdminControlsConfig(event);

      expect(config.buttonSize).toBe(34);
      expect(config.editPath).toEqual(['event', 'edit', event.id]);
      expect(config.itemName).toBe(event.title);
      expect(config.deleteCb).toBeDefined();
    });
  });

  describe('onDeleteEvent', () => {
    it('should open confirmation dialog with correct parameters', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');
      await component.onDeleteEvent(mockEvents[0]);

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Delete ${mockEvents[0].title}?`,
            confirmButtonText: 'Delete',
            confirmButtonType: 'warning',
          },
        },
        isModal: true,
      });
    });

    it('should emit request delete event when user confirms', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      await component.onDeleteEvent(mockEvents[2]);

      expect(requestDeleteEventSpy).toHaveBeenCalledWith(mockEvents[2]);
    });

    it('should not emit request delete event when user cancels', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');
      await component.onDeleteEvent(mockEvents[2]);

      expect(requestDeleteEventSpy).not.toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    describe('events table', () => {
      it('should render table with correct headers', () => {
        expect(query(fixture.debugElement, 'table.lcc-table')).toBeTruthy();

        const headers = queryAll(fixture.debugElement, 'th');
        expect(headers.length).toBe(2);
        expect(headers[0].nativeElement.textContent.trim()).toBe('Event');
        expect(headers[1].nativeElement.textContent.trim()).toBe('');
      });

      it('should render a row for every event and use correct IDs', () => {
        const eventRows = queryAll(fixture.debugElement, 'tbody tr[id]');
        expect(eventRows.length).toBe(mockEvents.length);
        expect(eventRows[0].nativeElement.id).toBe(mockEvents[0].id);
      });

      it('should add today-scroll-point class to next event row', () => {
        expect(
          query(fixture.debugElement, `tr#${mockNextEvent.id}`).classes[
            'today-scroll-point'
          ],
        ).toBe(true);
      });

      it('should display today line when next event is shown with past events', () => {
        const options = {
          ...mockOptions,
          filters: {
            showPastEvents: {
              label: 'Show past events',
              value: true,
            },
          },
        };
        fixture.componentRef.setInput('options', options);
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.today-line')).toBeTruthy();
      });

      it('should display all event dates in date widget format', () => {
        const dateWidgetElements = queryAll(fixture.debugElement, '.event-date-widget');

        dateWidgetElements.forEach(element => {
          expect(queryAll(element, '.date-text').length).toBe(3); // day-of-week, month-day, year
        });
      });

      it('should display event titles and details for all events', () => {
        const titleElements = queryAll(fixture.debugElement, '.title');
        const detailElements = queryAll(fixture.debugElement, '.event-details');

        titleElements.forEach((element, i) => {
          expect(element.nativeElement.textContent.trim()).toBe(mockEvents[i].title);
        });

        detailElements.forEach((element, i) => {
          expect(element.nativeElement.textContent.trim()).toBe(mockEvents[i].details);
        });
      });

      it('should display event types with correct styling', () => {
        expect(
          query(fixture.debugElement, '.type-container').classes[
            'blitz-tournament-10-mins'
          ],
        ).toBe(true);

        expect(queryTextContent(fixture.debugElement, '.type')).toBe(
          'blitz tournament (10 mins)',
        );
      });

      it('should display championship icon for championship events', () => {
        const championshipEvent = mockEvents.find(event => event.type === 'championship');
        fixture.componentRef.setInput('events', [championshipEvent!]);
        fixture.detectChanges();

        expect(queryTextContent(fixture.debugElement, '.championship-icon')).toBe(
          'emoji_events',
        );
      });

      it('should display article link when event has articleId', () => {
        const eventWithArticle = mockEvents.find(event => event.articleId !== null);
        fixture.componentRef.setInput('events', [eventWithArticle!]);
        fixture.detectChanges();

        const articleLink = query(fixture.debugElement, '.event-article-link');
        expect(articleLink.nativeElement.getAttribute('href')).toBe(
          '/article/view/' + eventWithArticle!.articleId,
        );
        expect(articleLink.nativeElement.textContent.trim()).toBe('More details');
      });

      it('should not display article link when event has no articleId', () => {
        const eventWithoutArticle = mockEvents.find(event => event.articleId === null);
        fixture.componentRef.setInput('events', [eventWithoutArticle!]);
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.event-article-link')).toBeFalsy();
      });

      it('should display modification info when showModificationInfo is true', () => {
        fixture.componentRef.setInput('showModificationInfo', true);
        fixture.detectChanges();

        const modInfoText = queryTextContent(fixture.debugElement, '.created-and-edited');
        expect(modInfoText).toContain('Event created');
        expect(modInfoText).toContain('Last edited');
      });

      it('should not display modification info when showModificationInfo is false', () => {
        fixture.componentRef.setInput('showModificationInfo', false);
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.created-and-edited')).toBeFalsy();
      });

      it('should show admin controls on rows when isAdmin is true', () => {
        fixture.componentRef.setInput('isAdmin', true);
        fixture.detectChanges();

        const row = query(fixture.debugElement, 'tbody tr');
        const adminControlsValue = row.componentInstance?.getAdminControlsConfig(
          component.events[0],
        );
        expect(adminControlsValue).toBeTruthy();
      });
    });
  });
});
