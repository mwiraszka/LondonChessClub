import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_EVENTS } from '@app/mocks/events.mock';
import { DialogService } from '@app/services';
import * as utils from '@app/utils';

import { ScheduleToolbarComponent } from './schedule-toolbar.component';

describe('ScheduleToolbarComponent', () => {
  let component: ScheduleToolbarComponent;
  let fixture: ComponentFixture<ScheduleToolbarComponent>;
  let dialogService: DialogService;

  let dateToISOStringSpy: jest.SpyInstance;
  let exportEventsToIcalSpy: jest.SpyInstance;
  let todayScrollPointSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleToolbarComponent],
      providers: [
        {
          provide: DialogService,
          useValue: { open: jest.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleToolbarComponent);
    component = fixture.componentInstance;

    dialogService = TestBed.inject(DialogService);

    dateToISOStringSpy = jest.spyOn(Date.prototype, 'toISOString');
    exportEventsToIcalSpy = jest.spyOn(utils, 'exportEventsToIcal');

    // Set up the spy before any change detection with a default return value
    todayScrollPointSpy = jest
      .spyOn(component, 'todayScrollPoint', 'get')
      .mockReturnValue(document.createElement('div'));

    fixture.componentRef.setInput('scheduleView', 'list');
    fixture.componentRef.setInput('filteredEvents', MOCK_EVENTS.slice(0, 3));
    fixture.componentRef.setInput('totalCount', MOCK_EVENTS.length);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onExportToIcal', () => {
    it('should call exportEventsToIcal with events and filename', async () => {
      exportEventsToIcalSpy.mockReturnValue(3);
      jest.spyOn(dialogService, 'open').mockResolvedValue('confirm');

      await component.onExportToIcal();

      expect(exportEventsToIcalSpy).toHaveBeenCalledWith(
        MOCK_EVENTS.slice(0, 3),
        expect.stringContaining('london_chess_club_events_'),
      );
      expect(exportEventsToIcalSpy).toHaveBeenCalledWith(
        MOCK_EVENTS.slice(0, 3),
        expect.stringContaining('.ics'),
      );
    });

    it('should disable button when there are no events', () => {
      fixture.componentRef.setInput('filteredEvents', []);
      fixture.detectChanges();

      const button = fixture.debugElement.nativeElement.querySelector(
        '.export-to-ical-button',
      );
      expect(button?.disabled).toBe(true);
    });

    it('should generate filename with current date', async () => {
      dateToISOStringSpy.mockReturnValue('2024-01-15T10:30:00.000Z');
      jest.spyOn(dialogService, 'open').mockResolvedValue('confirm');

      await component.onExportToIcal();

      expect(exportEventsToIcalSpy).toHaveBeenCalledTimes(1);
      expect(exportEventsToIcalSpy).toHaveBeenCalledWith(
        MOCK_EVENTS.slice(0, 3),
        'london_chess_club_events_2024-01-15.ics',
      );
    });

    it('should not export when dialog is cancelled', async () => {
      jest.spyOn(dialogService, 'open').mockResolvedValue('cancel');

      await component.onExportToIcal();

      expect(exportEventsToIcalSpy).not.toHaveBeenCalled();
    });
  });

  describe('onToday', () => {
    it('should scroll to today scroll point when it exists', () => {
      const mockElement = {
        scrollIntoView: jest.fn(),
      };
      todayScrollPointSpy.mockReturnValue(mockElement as unknown as Element);

      component.onToday();

      expect(mockElement.scrollIntoView).toHaveBeenCalledTimes(1);
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('should disable today button when today scroll point does not exist', () => {
      todayScrollPointSpy.mockReturnValue(null);

      // Force change detection to pick up the new mock value
      component.changeDetectorRef.detectChanges();

      const button = fixture.debugElement.nativeElement.querySelector('.today-button');
      expect(button?.disabled).toBe(true);
    });

    it('should enable today button when today scroll point exists', () => {
      const mockElement = { scrollIntoView: jest.fn() };
      todayScrollPointSpy.mockReturnValue(mockElement as unknown as Element);

      // Force change detection to pick up the new mock value
      component.changeDetectorRef.detectChanges();

      const button = fixture.debugElement.nativeElement.querySelector('.today-button');
      expect(button?.disabled).toBe(false);
    });
  });

  describe('toggleScheduleView output', () => {
    it('should emit toggleScheduleView event', () => {
      jest.spyOn(component.toggleScheduleView, 'emit');

      const toggleButton =
        fixture.debugElement.nativeElement.querySelector('lcc-toggle-switch');
      toggleButton?.dispatchEvent(new CustomEvent('toggle'));

      expect(component.toggleScheduleView.emit).toHaveBeenCalled();
    });
  });
});
