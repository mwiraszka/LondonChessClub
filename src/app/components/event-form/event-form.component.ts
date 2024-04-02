import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import type { ClubEvent, ModificationInfo } from '@app/types';
import { isDefined } from '@app/utils';
import { dateValidator } from '@app/validators';

import { EventFormFacade } from './event-form.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  providers: [EventFormFacade],
})
export class EventFormComponent implements OnInit {
  form!: FormGroup;
  modificationInfo!: ModificationInfo | null;
  valueChangesSubscription!: Subscription;

  constructor(public facade: EventFormFacade, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.facade.eventCurrently$
      .pipe(filter(isDefined), untilDestroyed(this))
      .subscribe(event => {
        this.initForm(event);
        this.modificationInfo = event.modificationInfo;
      });
  }

  hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('invalidDateFormat')) {
      return 'Invalid date format - please input as YYYY-MM-DD';
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
    this.form = this.formBuilder.group({
      eventDate: [event.eventDate, [Validators.required, dateValidator]],
      title: [event.title, [Validators.required, Validators.pattern(/[^\s]/)]],
      details: [event.details, [Validators.required, Validators.pattern(/[^\s]/)]],
      type: [event.type, [Validators.required]],
      id: [event.id],
      modificationInfo: [event.modificationInfo],
    });

    this.valueChangesSubscription = this.form.valueChanges
      .pipe(debounceTime(200), untilDestroyed(this))
      .subscribe((event: ClubEvent) => this.facade.onValueChange(event));
  }
}
