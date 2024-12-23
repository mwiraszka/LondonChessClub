import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { debounceTime, first } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DatePickerComponent } from '@app/components/date-picker/date-picker.component';
import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import { EventsActions, EventsSelectors } from '@app/store/events';
import type { ControlMode, EventFormData, EventFormGroup } from '@app/types';
import { isDefined, isTime } from '@app/utils';
import { timeValidator } from '@app/validators';

@UntilDestroy()
@Component({
  selector: 'lcc-event-form',
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
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
  public readonly eventFormViewModel$ = this.store.select(
    EventsSelectors.selectEventFormViewModel,
  );
  public form: FormGroup<EventFormGroup<EventFormData>> | null = null;

  private readonly controlMode$ = this.store.select(EventsSelectors.selectControlMode);
  private controlMode: ControlMode | null = null;
  private readonly eventFormData$ = this.store.select(
    EventsSelectors.selectEventFormData,
  );

  constructor(
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.controlMode$.pipe(first(isDefined)).subscribe(controlMode => {
      this.controlMode = controlMode;
    });

    this.eventFormData$.pipe(first(isDefined)).subscribe(eventFormData => {
      this.initForm(eventFormData);
      this.initFormValueChangeListener();
    });
  }

  public hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  public getErrorMessage(control: AbstractControl): string {
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

  public onCancel(): void {
    this.store.dispatch(EventsActions.cancelSelected());
  }

  public onSubmit(eventTitle?: string): void {
    if (this.form?.invalid || !eventTitle) {
      this.form?.markAllAsTouched();
      return;
    }

    if (this.controlMode === 'edit') {
      this.store.dispatch(
        EventsActions.updateEventSelected({
          eventTitle,
        }),
      );
    } else {
      this.store.dispatch(
        EventsActions.addEventSelected({
          eventTitle,
        }),
      );
    }
  }

  private initForm(eventFormData: EventFormData): void {
    // Displayed in local time since America/Toronto set as default timezone in app.component
    const eventTime: string = moment(eventFormData.eventDate).format('h:mm A');

    this.form = this.formBuilder.group({
      eventDate: new FormControl(eventFormData.eventDate, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      eventTime: new FormControl(eventTime, {
        nonNullable: true,
        validators: [Validators.required, timeValidator],
      }),
      title: new FormControl(eventFormData.title, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      details: new FormControl(eventFormData.details, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      type: new FormControl(eventFormData.type, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      articleId: new FormControl(eventFormData.articleId, [
        Validators.pattern(/^[a-fA-F0-9]{24}$/),
      ]),
    });
  }

  private initFormValueChangeListener(): void {
    this.form?.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe((value: Partial<EventFormData & { eventTime: string }>) => {
        const { eventTime, ...eventFormData } = value;

        if (!!eventTime && isTime(eventTime)) {
          let hours = Number(eventTime.split(':')[0]) % 12;
          if (eventTime.slice(-2).toUpperCase() === 'PM') {
            hours += 12;
          }
          const minutes = Number(eventTime.split(':')[1].slice(0, 2));

          eventFormData.eventDate = moment(eventFormData.eventDate)
            .hours(hours)
            .minutes(minutes)
            .toISOString();
        }

        return this.store.dispatch(EventsActions.formValueChanged({ value }));
      });
  }
}
