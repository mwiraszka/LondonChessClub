import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { debounceTime } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { DatePickerComponent } from '@app/components/date-picker/date-picker.component';
import { FormErrorIconComponent } from '@app/components/form-error-icon/form-error-icon.component';
import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import IconsModule from '@app/icons';
import type {
  BasicDialogResult,
  Dialog,
  Event,
  EventFormData,
  EventFormGroup,
} from '@app/models';
import { DialogService } from '@app/services';
import { EventsActions } from '@app/store/events';
import { isValidTime } from '@app/utils';
import { timeValidator } from '@app/validators';

@UntilDestroy()
@Component({
  selector: 'lcc-event-form',
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
  imports: [
    CommonModule,
    DatePickerComponent,
    FormErrorIconComponent,
    IconsModule,
    ModificationInfoComponent,
    ReactiveFormsModule,
  ],
})
export class EventFormComponent implements OnInit {
  @Input({ required: true }) formData!: EventFormData;
  @Input({ required: true }) hasUnsavedChanges!: boolean;
  @Input({ required: true }) originalEvent!: Event | null;

  public form!: FormGroup<EventFormGroup>;

  constructor(
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.initForm(this.formData);
    this.initFormValueChangeListener();

    if (this.hasUnsavedChanges) {
      this.form.markAllAsTouched();
    }
  }

  public onCancel(): void {
    this.store.dispatch(EventsActions.cancelSelected());
  }

  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dialog: Dialog = {
      title: this.originalEvent ? 'Update event' : 'Add new event',
      body: this.originalEvent
        ? `Update ${this.originalEvent.title}?`
        : `Add ${this.formData.title}?`,
      confirmButtonText: this.originalEvent ? 'Update' : 'Add',
    };

    const result = await this.dialogService.open<BasicDialogComponent, BasicDialogResult>(
      {
        componentType: BasicDialogComponent,
        inputs: { dialog },
        isModal: false,
      },
    );

    if (result !== 'confirm') {
      return;
    }

    if (this.originalEvent) {
      this.store.dispatch(
        EventsActions.updateEventRequested({ eventId: this.originalEvent.id }),
      );
    } else {
      this.store.dispatch(EventsActions.addEventRequested());
    }
  }

  private initForm(formData: EventFormData): void {
    // Displayed in local time since America/Toronto set as default timezone in app.component
    const eventTime: string = moment(formData.eventDate).format('h:mm A');

    this.form = this.formBuilder.group({
      eventDate: new FormControl(formData.eventDate, {
        nonNullable: true,
        validators: Validators.required,
      }),
      eventTime: new FormControl(eventTime, {
        nonNullable: true,
        validators: [Validators.required, timeValidator],
      }),
      title: new FormControl(formData.title, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      details: new FormControl(formData.details, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      type: new FormControl(formData.type, {
        nonNullable: true,
        validators: Validators.required,
      }),
      articleId: new FormControl(
        formData.articleId,
        Validators.pattern(/^[a-fA-F0-9]{24}$/),
      ),
    });
  }

  private initFormValueChangeListener(): void {
    this.form?.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe((value: Partial<EventFormData & { eventTime: string }>) => {
        const { eventTime, ...formData } = value;

        if (isValidTime(eventTime)) {
          let hours = Number(eventTime.split(':')[0]) % 12;
          if (eventTime.slice(-2).toUpperCase() === 'PM') {
            hours += 12;
          }
          const minutes = Number(eventTime.split(':')[1].slice(0, 2));

          formData.eventDate = moment(formData.eventDate)
            .hours(hours)
            .minutes(minutes)
            .toISOString();
        }

        return this.store.dispatch(
          EventsActions.formValueChanged({
            eventId: this.originalEvent?.id ?? null,
            value: formData,
          }),
        );
      });

    // Manually trigger form value change to pass initial form data to store
    this.form?.updateValueAndValidity();
  }
}
