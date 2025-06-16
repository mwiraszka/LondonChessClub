import moment from 'moment-timezone';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { query, queryAll, queryTextContent } from '@app/utils';

import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeAll(() => moment.tz.setDefault('UTC'));
  afterAll(() => moment.tz.setDefault());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatePickerComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DatePickerComponent);
        component = fixture.componentInstance;

        component.currentMonth = moment('2050-01-01');
        component.screenWidth = 1000;
        component.selectedDate = moment('2050-01-01');

        // Initialize the calendar data
        component.renderCalendar();
        fixture.detectChanges();
      });
  });

  describe('header', () => {
    it('should render previous month button', () => {
      expect(query(fixture.debugElement, '.previous-month-button')).not.toBeNull();
    });

    it('should render next month button', () => {
      expect(query(fixture.debugElement, '.next-month-button')).not.toBeNull();
    });

    it('should render the currently selected month and year as the title', () => {
      expect(queryTextContent(fixture.debugElement, '.title')).toBe('January 2050');
    });

    it('should shorten the month text on small screens', () => {
      component.screenWidth = 300;
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.title')).toBe('Jan 2050');
    });

    it('should subtract one month when previous month button is clicked', () => {
      const onPreviousMonthSpy = jest.spyOn(component, 'onPreviousMonth');
      const renderCalendarSpy = jest
        .spyOn(component, 'renderCalendar')
        .mockImplementation(() => '');

      query(fixture.debugElement, '.previous-month-button').triggerEventHandler('click');

      expect(onPreviousMonthSpy).toHaveBeenCalledTimes(1);
      expect(renderCalendarSpy).toHaveBeenCalledTimes(1);
      expect(moment(component.currentMonth).format('MMMM YYYY')).toBe('December 2049');
    });

    it('should add one month when next month button is clicked', () => {
      const onNextMonthSpy = jest.spyOn(component, 'onNextMonth');
      const renderCalendarSpy = jest
        .spyOn(component, 'renderCalendar')
        .mockImplementation(() => '');

      query(fixture.debugElement, '.next-month-button').triggerEventHandler('click');

      expect(onNextMonthSpy).toHaveBeenCalledTimes(1);
      expect(renderCalendarSpy).toHaveBeenCalledTimes(1);
      expect(moment(component.currentMonth).format('MMMM YYYY')).toBe('February 2050');
    });
  });

  describe('calendar table', () => {
    it('should render a 7 x 6 table for every month, regardless of number of days', () => {
      const table = query(fixture.debugElement, '.calendar-table');
      const headerCells = queryAll(table, 'thead th');
      const bodyRows = queryAll(table, 'tbody tr');
      const dayCells = queryAll(table, 'tbody tr td');

      expect(table).not.toBeNull();
      expect(headerCells.length).toBe(component.DAYS_OF_WEEK.length);
      expect(headerCells[0].nativeElement.textContent).toBe('Sun');
      expect(headerCells[6].nativeElement.textContent).toBe('Sat');
      expect(bodyRows.length).toBe(component.WEEKS_IN_CALENDAR);
      // 7 days x 6 weeks = 42 day cells
      expect(dayCells.length).toBe(42);
    });

    it('should mark days outside current month as disabled', () => {
      let disabledCount = 0;

      component.calendarDays.forEach(week => {
        week.forEach(day => {
          if (day.disabled) {
            disabledCount++;
          }
        });
      });

      // January 2050 starts on a Saturday, so first week has 6 days from previous month;
      // ends on a Monday, so last 5 days are from the following month.
      expect(disabledCount).toBe(11);
    });

    it('should highlight the selected date', () => {
      component.selectedDate = moment('2050-01-15');
      component.renderCalendar();
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.selected-day')).toBe('15');
    });

    it('should call onSelectCell when a day is clicked', () => {
      const onSelectCellSpy = jest.spyOn(component, 'onSelectCell');

      // Use the first day cell directly
      const firstCell = query(
        fixture.debugElement,
        'tbody tr:first-child td:first-child',
      );
      firstCell.triggerEventHandler('click');

      expect(onSelectCellSpy).toHaveBeenCalledWith(0, 0);
    });

    it('should update selected date when a day is clicked', () => {
      // @ts-expect-error Private class member
      const onChangeSpy = jest.spyOn(component, 'onChange');

      component.selectedDate = moment('2049-12-01'); // Different from any day in the calendar
      component.renderCalendar();
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.selected-day')).toBeNull();

      query(
        fixture.debugElement,
        'tbody tr:nth-child(2) td:nth-child(1)',
      ).triggerEventHandler('click');
      fixture.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith('2050-01-02T00:00:00.000Z');
      expect(query(fixture.debugElement, '.selected-day')).not.toBeNull();
    });

    it('should display the selected date in the footer', () => {
      component.selectedDate = moment('2050-01-15');
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.selected-date')).toBe(
        'Saturday, January 15th 2050',
      );

      component.screenWidth = 300;
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.selected-date')).toBe(
        'Sat, Jan 15th 2050',
      );
    });
  });
});
