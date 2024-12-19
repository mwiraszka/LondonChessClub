import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import moment from 'moment-timezone';
import { combineLatestWith, debounceTime, filter, first } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DatePickerComponent } from '@app/components/date-picker/date-picker.component';
import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import type { Event } from '@app/types';
import { isDefined, isTime } from '@app/utils';
import { timeValidator } from '@app/validators';

import { EventFormFacade } from './event-form.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  providers: [EventFormFacade],
  imports: [
    CommonModule,
    DatePickerComponent,
    IconsModule,
    ModificationInfoComponent,
    ReactiveFormsModule,
    TooltipDirective,
  ],
})
export class EventFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    public facade: EventFormFacade,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.facade.setEvent$
      .pipe(filter(isDefined), combineLatestWith(this.facade.formEvent$), first())
      .subscribe(([setEvent, formEvent]) => {
        if (!formEvent) {
          formEvent = setEvent;
        }

        this.initForm(formEvent);
        this.initValueChangesListener();
      });
  }

  hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('invalidTimeFormat')) {
      return 'Invalid time - please input in hh:mm AM/PM format';
    } else if (control.hasError('pattern')) {
      return 'Invalid input (incorrect format)';
    } else {
      return 'Unknown error';
    }
  }

  onCancel(): void {
    this.facade.onCancel();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.facade.onSubmit(this.form.value);
  }

  private initForm(event: Event): void {
    // Displayed in local time since America/Toronto set as default timezone in app.component
    const eventTime: string = moment(event.eventDate).format('h:mm A');

    this.form = this.formBuilder.group({
      eventDate: [event.eventDate, [Validators.required]],
      eventTime: [eventTime, [Validators.required, timeValidator]],
      title: [event.title, [Validators.required, Validators.pattern(/[^\s]/)]],
      details: [event.details, [Validators.required, Validators.pattern(/[^\s]/)]],
      type: [event.type, [Validators.required]],
      articleId: [event.articleId, [Validators.pattern(/^[a-fA-F0-9]{24}$/)]],
      id: [event.id],
      modificationInfo: [event.modificationInfo],
    });
  }

  private initValueChangesListener(): void {
    this.form.valueChanges
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe((formData: Event & { eventTime: string }) => {
        const { eventTime, ...event } = formData;

        if (isTime(eventTime)) {
          let hours = Number(eventTime.split(':')[0]) % 12;
          if (eventTime.slice(-2).toUpperCase() === 'PM') {
            hours += 12;
          }
          const minutes = Number(eventTime.split(':')[1].slice(0, 2));
          event.eventDate = moment(event.eventDate)
            .hours(hours)
            .minutes(minutes)
            .toISOString();
        }

        return this.facade.onValueChange(event);
      });
  }
}
