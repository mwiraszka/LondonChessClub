import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, first, tap } from 'rxjs/operators';

import { LoaderService } from '@app/shared/services';
import { Member } from '@app/shared/types';
import {
  dateValidator,
  emailValidator,
  phoneNumberValidator,
  ratingValidator,
} from '@app/shared/validators';

import { MemberEditorScreenFacade } from './member-editor-screen.facade';

@Component({
  selector: 'lcc-member-editor-screen',
  templateUrl: './member-editor-screen.component.html',
  styleUrls: ['./member-editor-screen.component.scss'],
  providers: [MemberEditorScreenFacade],
})
export class MemberEditorScreenComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  valueChangesSubscription!: Subscription;
  memberFullName!: string;

  constructor(
    public facade: MemberEditorScreenFacade,
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
    } else if (control.errors.hasOwnProperty('invalidDateFormat')) {
      return 'Invalid date';
    } else if (control.errors.hasOwnProperty('invalidEmailFormat')) {
      return 'Invalid email';
    } else if (control.errors.hasOwnProperty('invalidPhoneNumberFormat')) {
      return 'Invalid phone number';
    } else if (control.errors.hasOwnProperty('invalidRating')) {
      return 'Invalid rating';
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
      firstName: [
        member.firstName,
        {
          validators: [Validators.required, Validators.pattern(/[^\s]/)],
          updateOn: 'change',
        },
      ],
      lastName: [
        member.lastName,
        {
          validators: [Validators.required, Validators.pattern(/[^\s]/)],
          updateOn: 'change',
        },
      ],
      city: [
        member.city,
        {
          validators: [Validators.required, Validators.pattern(/[^\s]/)],
          updateOn: 'change',
        },
      ],
      rating: [
        member.rating,
        {
          validators: [Validators.required, ratingValidator, Validators.max(3000)],
          updateOn: 'change',
        },
      ],
      dateJoined: [
        member.dateJoined,
        { validators: [Validators.required, dateValidator], updateOn: 'change' },
      ],
      email: [member.email, { validators: emailValidator, updateOn: 'change' }],
      phoneNumber: [
        member.phoneNumber,
        { validators: phoneNumberValidator, updateOn: 'change' },
      ],
      yearOfBirth: [
        member.yearOfBirth,
        {
          validators: [
            Validators.min(1900),
            Validators.max(new Date().getFullYear() - 4),
          ],
          updateOn: 'change',
        },
      ],
      chesscomUsername: [
        member.chesscomUsername,
        { validators: Validators.pattern(/[^\s]/), updateOn: 'change' },
      ],
      lichessUsername: [
        member.lichessUsername,
        { validators: Validators.pattern(/[^\s]/), updateOn: 'change' },
      ],
      isActive: [
        member.isActive,
        { validators: Validators.required, updateOn: 'change' },
      ],
    });

    this.valueChangesSubscription = this.form.valueChanges
      .pipe(debounceTime(200))
      .subscribe((member: Member) => this.facade.onValueChange(member));
  }
}
