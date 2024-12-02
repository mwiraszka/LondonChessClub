import moment, { Moment } from 'moment-timezone';

import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, HostListener, Inject } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import { IconsModule } from '@app/icons';
import { RangePipe } from '@app/pipes/range.pipe';

@Component({
  standalone: true,
  selector: 'lcc-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DatePickerComponent,
      multi: true,
    },
  ],
  imports: [CommonModule, IconsModule, RangePipe, ReactiveFormsModule],
})
export class DatePickerComponent implements AfterViewInit, ControlValueAccessor {
  // Always render 6 weeks in calendar (the most that will ever be needed for any month)
  // to prevent layout shifts when switching between months
  readonly WEEKS_IN_CALENDAR = 6;
  readonly DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  selectedDate!: Moment;
  currentMonth!: Moment;
  screenWidth = window.innerWidth;

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  ngAfterViewInit(): void {
    this.renderCalendar(this.selectedDate);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;
  }

  writeValue(date: Date): void {
    if (!date) {
      console.error(
        "[LCC] No date provided to Date Picker - using today's date as fallback",
      );
      date = new Date();
    }

    this.selectedDate = this.currentMonth = moment(date);
  }

  registerOnChange(fn: (_: any) => any): void {
    this.onChange = fn;
  }

  // Not implemented for this component since it is always
  // initiated with a value, and therefore touched upon creation
  registerOnTouched(fn: (_: any) => any): void {}

  private onChange(date: Date): Date {
    return date;
  }

  onPreviousMonth(): void {
    this.currentMonth.subtract(1, 'month');
    this.renderCalendar(this.selectedDate);
  }

  onNextMonth(): void {
    this.currentMonth.add(1, 'month');
    this.renderCalendar(this.selectedDate);
  }

  onSelectCell(row: number, column: number): void {
    this.selectedDate = this.getCalendarStart(this.currentMonth)
      .add(row, 'weeks')
      .add(column, 'days');
    this.renderCalendar(this.selectedDate);
    this.onChange(this.selectedDate.toDate());
  }

  private renderCalendar(selectedDate: Moment): void {
    let day = this.getCalendarStart(selectedDate);

    const weekRows = Array.from(
      this._document.querySelectorAll('lcc-date-picker .calendar-table tbody tr'),
    );

    for (let i = 0; i < this.WEEKS_IN_CALENDAR; i++) {
      const dayCells = Array.from(weekRows[i].querySelectorAll('td'));

      for (let j = 0; j < this.DAYS_OF_WEEK.length; j++) {
        const dayCell = dayCells[j];

        dayCell.textContent = day.format('D');

        const dayInCurrentMonth = day.isSame(selectedDate, 'month');

        if (!dayInCurrentMonth) {
          dayCell.setAttribute('disabled', 'disabled');
        } else {
          dayCell.removeAttribute('disabled');
        }

        if (day.isSame(this.currentMonth, 'month') && day.isSame(selectedDate, 'day')) {
          dayCell.classList.add('lcc-selected-day');
        } else {
          dayCell.classList.remove('lcc-selected-day');
        }

        day.add(1, 'day');
      }
    }
  }

  private getCalendarStart(date: Moment): Moment {
    return date.clone().startOf('month').startOf('week');
  }
}
