import moment from 'moment-timezone';

import { DOCUMENT } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

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

        TestBed.inject(DOCUMENT);

        fixture.detectChanges();
      });
  });

  describe('header', () => {
    it('should render previous month button', () => {
      expect(element('.previous-month-button')).not.toBeNull();
    });

    it('should render next month button', () => {
      expect(element('.next-month-button')).not.toBeNull();
    });

    it('should render the currently selected month and year as the title', () => {
      expect(element('.title').nativeElement.textContent.trim()).toBe('January 2050');
    });

    it('should shorten the month text on small screens', () => {
      component.screenWidth = 300;
      fixture.detectChanges();

      expect(element('.title').nativeElement.textContent.trim()).toBe('Jan 2050');
    });

    it('should subtract one month when previous month button is clicked', () => {
      const onPreviousMonthSpy = jest.spyOn(component, 'onPreviousMonth');
      const renderCalendarSpy = jest
        .spyOn(component, 'renderCalendar')
        .mockImplementation(() => '');

      element('.previous-month-button').triggerEventHandler('click');

      expect(onPreviousMonthSpy).toHaveBeenCalledTimes(1);
      expect(renderCalendarSpy).toHaveBeenCalledTimes(1);
      expect(moment(component.currentMonth).format('MMMM YYYY')).toBe('December 2049');
    });

    it('should add one month when next month button is clicked', () => {
      const onNextMonthSpy = jest.spyOn(component, 'onNextMonth');
      const renderCalendarSpy = jest
        .spyOn(component, 'renderCalendar')
        .mockImplementation(() => '');

      element('.next-month-button').triggerEventHandler('click');

      expect(onNextMonthSpy).toHaveBeenCalledTimes(1);
      expect(renderCalendarSpy).toHaveBeenCalledTimes(1);
      expect(moment(component.currentMonth).format('MMMM YYYY')).toBe('February 2050');
    });
  });

  describe('calendar table', () => {
    it('should render a 7 x 6 table for every month, regardless of number of days', () => {
      expect(element('.calendar-table')).not.toBeNull();

      // TODO: more details about calendar table & test day selection
    });
  });

  function element(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }
});
