import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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
import { ModificationInfoModule } from '@app/components/modification-info';
import { TooltipModule } from '@app/components/tooltip/tooltip.module';
import { IconsModule } from '@app/icons';
import type { ClubEvent } from '@app/types';
import { articleIdRegExp, isDefined } from '@app/utils';
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
    ModificationInfoModule,
    ReactiveFormsModule,
    TooltipModule,
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
      return 'Invalid time format - please input as HH:MM AM or HH:MM PM';
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
    const eventTime = event.eventDate.toLocaleTimeString();
    console.log(':: eventTime', eventTime);
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
      .subscribe((event: ClubEvent) => this.facade.onValueChange(event));
  }
}
