import { Subscription } from 'rxjs';
import { debounceTime, first, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoaderService } from '@app/services';
import { ClubEvent } from '@app/types';
import { dateValidator } from '@app/validators';

import { EventFormFacade } from './event-form.facade';

@Component({
  selector: 'lcc-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  providers: [EventFormFacade],
})
export class EventFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  valueChangesSubscription!: Subscription;

  constructor(
    public facade: EventFormFacade,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loader.display(true);

    this.facade.eventCurrently$
      .pipe(
        tap(event => this.initForm(event)),
        tap(() => this.loader.display(false)),
        first(),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.valueChangesSubscription.unsubscribe();
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
      dateCreated: [event.dateCreated],
      dateEdited: [event.dateEdited],
    });

    this.valueChangesSubscription = this.form.valueChanges
      .pipe(debounceTime(200))
      .subscribe((event: ClubEvent) => this.facade.onValueChange(event));
  }
}
