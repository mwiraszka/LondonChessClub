import moment, { Moment } from 'moment-timezone';

import { AfterViewInit, Component, HostListener } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import type { IsoDate } from '@app/models';

@Component({
  selector: 'lcc-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DatePickerComponent,
      multi: true,
    },
  ],
  imports: [MatIconModule, ReactiveFormsModule],
})
export class DatePickerComponent implements AfterViewInit, ControlValueAccessor {
  // Always render 6 weeks in calendar (the most that will ever be needed for any month)
  // to prevent layout shifts when switching between months
  public readonly WEEKS_IN_CALENDAR = 6;
  public readonly DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  public calendarDays: { date: Moment; disabled: boolean; selected: boolean }[][] = [];
  // Used to keep track of the month & year currently in calendar
  public currentMonth!: Moment;
  public screenWidth = window.innerWidth;
  public selectedDate!: Moment;

  constructor() {}

  ngAfterViewInit(): void {
    // Prevent Angular's ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => this.renderCalendar());
  }

  @HostListener('window:resize', ['$event'])
  private onResize = () => (this.screenWidth = window.innerWidth);

  public writeValue(date: IsoDate): void {
    if (!date) {
      console.error(
        "[LCC] No date provided to Date Picker - using today's date as fallback.",
      );
      this.currentMonth = moment();
      this.selectedDate = moment();
    }

    this.currentMonth = moment(date);
    this.selectedDate = moment(date);
  }

  public registerOnChange(fn: (date: IsoDate) => IsoDate): void {
    this.onChange = fn;
  }

  // Not implemented for this component since it is always initiated with a value,
  // and therefore touched upon creation
  public registerOnTouched(): void {}

  private onChange(date: IsoDate): IsoDate {
    return date;
  }

  public onPreviousMonth(): void {
    this.currentMonth.subtract(1, 'month');
    this.renderCalendar();
  }

  public onNextMonth(): void {
    this.currentMonth.add(1, 'month');
    this.renderCalendar();
  }

  public onSelectCell(row: number, column: number): void {
    this.selectedDate = this.getCalendarFirstDay().add(row, 'weeks').add(column, 'days');
    this.renderCalendar();
    this.onChange(this.selectedDate.toISOString());
  }

  public renderCalendar(): void {
    const day = this.getCalendarFirstDay();
    this.calendarDays = [];

    for (let i = 0; i < this.WEEKS_IN_CALENDAR; i++) {
      const week: { date: Moment; disabled: boolean; selected: boolean }[] = [];

      for (let j = 0; j < this.DAYS_OF_WEEK.length; j++) {
        const currentDay = day.clone();
        const dayInCurrentMonth = currentDay.isSame(this.currentMonth, 'month');
        const isSelected = currentDay.isSame(this.selectedDate, 'day');

        week.push({
          date: currentDay,
          disabled: !dayInCurrentMonth,
          selected: isSelected,
        });

        day.add(1, 'day');
      }

      this.calendarDays.push(week);
    }
  }

  private getCalendarFirstDay(): Moment {
    return this.currentMonth.clone().startOf('month').startOf('week');
  }
}
