import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, first, tap } from 'rxjs/operators';

import { LoaderService } from '@app/services';
import { Member } from '@app/types';
import {
  dateValidator,
  emailValidator,
  phoneNumberValidator,
  ratingValidator,
  yearValidator,
} from '@app/validators';

import { MemberFormFacade } from './member-form.facade';

@Component({
  selector: 'lcc-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.scss'],
  providers: [MemberFormFacade],
})
export class MemberFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  valueChangesSubscription!: Subscription;
  memberFullName!: string;

  constructor(
    public facade: MemberFormFacade,
    private formBuilder: FormBuilder,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loader.display(true);

    this.facade.memberCurrently$
      .pipe(
        tap((member) => this.initForm(member)),
        first()
      )
      .subscribe();

    this.facade.memberBeforeEdit$
      .pipe(
        tap((member) => (this.memberFullName = member.firstName + ' ' + member.lastName)),
        tap(() => this.loader.display(false)),
        first()
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
    if (control.errors.hasOwnProperty('required')) {
      return 'This field is required';
    } else if (control.errors.hasOwnProperty('invalidRating')) {
      return 'Invalid rating';
    } else if (control.errors.hasOwnProperty('invalidDateFormat')) {
      return 'Invalid date format - please input as YYYY-MM-DD';
    } else if (control.errors.hasOwnProperty('invalidEmailFormat')) {
      return 'Invalid email';
    } else if (control.errors.hasOwnProperty('invalidPhoneNumberFormat')) {
      return 'Invalid phone number format - please input as XXX-XXX-XXXX';
    } else if (control.errors.hasOwnProperty('invalidYear')) {
      return 'Invalid year';
    } else if (control.errors.hasOwnProperty('pattern')) {
      return 'Invalid input (incorrect format)';
    } else if (control.errors.hasOwnProperty('minlength')) {
      return 'Invalid input (number too low)';
    } else if (control.errors.hasOwnProperty('maxlength')) {
      return 'Invalid input (number too high)';
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

  private initForm(member: Member): void {
    this.form = this.formBuilder.group({
      firstName: [member.firstName, [Validators.required, Validators.pattern(/[^\s]/)]],
      lastName: [member.lastName, [Validators.required, Validators.pattern(/[^\s]/)]],
      city: [member.city, [Validators.required, Validators.pattern(/[^\s]/)]],
      rating: [
        member.rating,
        [Validators.required, ratingValidator, Validators.max(3000)],
      ],
      dateJoined: [member.dateJoined, [Validators.required, dateValidator]],
      email: [member.email, emailValidator],
      phoneNumber: [member.phoneNumber, phoneNumberValidator],
      yearOfBirth: [member.yearOfBirth, yearValidator],
      chesscomUsername: [member.chesscomUsername, Validators.pattern(/[^\s]/)],
      lichessUsername: [member.lichessUsername, Validators.pattern(/[^\s]/)],
      isActive: [member.isActive, Validators.required],
      id: [member.id],
      peakRating: [member.peakRating],
    });

    this.valueChangesSubscription = this.form.valueChanges
      .pipe(debounceTime(200))
      .subscribe((member: Member) => this.facade.onValueChange(member));
  }
}
