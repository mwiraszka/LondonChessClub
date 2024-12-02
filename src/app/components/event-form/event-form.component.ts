import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import moment from 'moment-timezone';
import { debounceTime, filter, first } from 'rxjs/operators';

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
import type { ClubEvent } from '@app/types';
import { articleIdRegExp, isDefined, isValidTime } from '@app/utils';
import { timeValidator } from '@app/validators';

import { EventFormFacade } from './event-form.facade';

@UntilDestroy()
@Component({
  standalone: true,
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
    this.facade.formEvent$.pipe(filter(isDefined), first()).subscribe(event => {
      this.initForm(event);
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

  private initForm(event: ClubEvent): void {
    const eventTime: string = moment(event.eventDate).format('h:mm A');

    this.form = this.formBuilder.group({
      eventDate: [event.eventDate, [Validators.required]],
      eventTime: [eventTime, [Validators.required, timeValidator]],
      title: [event.title, [Validators.required, Validators.pattern(/[^\s]/)]],
      details: [event.details, [Validators.required, Validators.pattern(/[^\s]/)]],
      type: [event.type, [Validators.required]],
      articleId: [event.articleId, [Validators.pattern(articleIdRegExp)]],
      id: [event.id],
      modificationInfo: [event.modificationInfo],
    });
  }

  private initValueChangesListener(): void {
    this.form.valueChanges
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe((formData: ClubEvent & { eventTime: string }) => {
        const { eventTime, ...event } = formData;

        if (isValidTime(eventTime)) {
          let hours = Number(eventTime.split(':')[0]);
          if (eventTime.slice(-2).toUpperCase() === 'PM') {
            hours += 12;
          }
          const minutes = Number(eventTime.split(':')[1].slice(0, 2));

          event.eventDate = new Date(event.eventDate.setHours(hours, minutes, 0, 0));
        }

        return this.facade.onValueChange(event);
      });
  }
}
