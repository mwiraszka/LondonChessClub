import moment from 'moment-timezone';

import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  Renderer2,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import { IconsModule } from '@app/icons';
import { PipesModule } from '@app/pipes';

@Component({
  standalone: true,
  selector: 'lcc-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
  imports: [CommonModule, IconsModule, PipesModule, ReactiveFormsModule],
})
export class DatePickerComponent implements AfterViewInit, ControlValueAccessor {
  // Always render 6 weeks in calendar (the most that will ever be needed for any month)
  // to prevent layout shifts when switching between months
  readonly WEEKS_IN_CALENDAR = 6;
  readonly DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  currentDate = moment().subtract(5, 'hours');
  screenWidth = window.innerWidth;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    this.renderCalendar();
    console.log(':: currentDate', this.currentDate);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;
  }

  writeValue(obj: any): void {
    console.log(':: writeValue()', obj);
  }

  registerOnChange(fn: any): void {
    console.log(':: registerOnChange()', fn);
  }

  registerOnTouched(fn: any): void {
    console.log(':: registerOnChange()', fn);
  }

  onPreviousMonth(): void {
    this.currentDate.subtract(1, 'month');
    this.renderCalendar();
  }

  onNextMonth(): void {
    this.currentDate.add(1, 'month');
    this.renderCalendar();
  }

  onSelectDay(weekNumber: number, dayNumber: number): void {
    this.removePreviouslySelectedDay();

    const weekRowElements = this.getWeekRowElements();
    const day = Array.from(weekRowElements[weekNumber].querySelectorAll('td'))[dayNumber];

    this.renderer.addClass(day, 'lcc-selected-day');

    const selectedDay = this.currentDate
      .clone()
      .startOf('month')
      .startOf('week')
      .add(weekNumber, 'weeks')
      .add(dayNumber, 'days');

    console.log(':: selected day', selectedDay.toDate());
  }

  private removePreviouslySelectedDay(): void {
    const dayCellElements = this.getDayCellElements();
    const previouslySelectedDay = dayCellElements.find(element =>
      element.classList.contains('lcc-selected-day'),
    );

    if (previouslySelectedDay) {
      this.renderer.removeClass(previouslySelectedDay, 'lcc-selected-day');
    }
  }

  private renderCalendar(): void {
    this.removePreviouslySelectedDay();

    const weekRows = this.getWeekRowElements();
    let day = this.currentDate.clone().startOf('month').startOf('week');

    for (let i = 0; i < this.WEEKS_IN_CALENDAR; i++) {
      for (let j = 0; j < this.DAYS_OF_WEEK.length; j++) {
        const dayCells = Array.from(weekRows[i].querySelectorAll('td'));

        dayCells[j].textContent = day.format('D');

        const isCurrentMonth = day.isSame(this.currentDate, 'month');

        if (!isCurrentMonth) {
          dayCells[j].setAttribute('disabled', 'disabled');
        } else {
          dayCells[j].removeAttribute('disabled');
        }

        day.add(1, 'day');
      }
    }
  }

  private getWeekRowElements(): HTMLTableRowElement[] {
    return Array.from(
      this._document.querySelectorAll('lcc-date-picker .calendar-table tbody tr'),
    );
  }

  private getDayCellElements(): HTMLTableCellElement[] {
    return Array.from(
      this._document.querySelectorAll('lcc-date-picker .calendar-table tbody tr td'),
    );
  }
}
