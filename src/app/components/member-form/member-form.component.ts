import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
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

import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import { MembersActions, MembersSelectors } from '@app/store/members';
import type { ControlMode, MemberFormData, MemberFormGroup } from '@app/types';
import { isDefined } from '@app/utils';
import {
  emailValidator,
  phoneNumberValidator,
  ratingValidator,
  yearOfBirthValidator,
} from '@app/validators';

import { DatePickerComponent } from '../date-picker/date-picker.component';

@UntilDestroy()
@Component({
  selector: 'lcc-member-form',
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.scss',
  imports: [
    CommonModule,
    DatePickerComponent,
    IconsModule,
    ModificationInfoComponent,
    ReactiveFormsModule,
    TooltipDirective,
  ],
})
export class MemberFormComponent implements OnInit {
  public readonly memberFormViewModel$ = this.store.select(
    MembersSelectors.selectMemberFormViewModel,
  );
  public form: FormGroup<MemberFormGroup<MemberFormData>> | null = null;

  private readonly memberFormData$ = this.store.select(
    MembersSelectors.selectMemberFormData,
  );
  private readonly controlMode$ = this.store.select(MembersSelectors.selectControlMode);
  private controlMode: ControlMode | null = null;

  constructor(
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.controlMode$.pipe(first(isDefined)).subscribe(controlMode => {
      this.controlMode = controlMode;
    });

    this.memberFormData$.pipe(first(isDefined)).subscribe(memberFormData => {
      this.initForm(memberFormData);
      this.initFormValueChangeListener();
    });
  }

  public hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  public getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('invalidRating')) {
      return 'Invalid rating';
    } else if (control.hasError('invalidEmailFormat')) {
      return 'Invalid email';
    } else if (control.hasError('invalidPhoneNumberFormat')) {
      return 'Invalid phone number format - please input as XXX-XXX-XXXX';
    } else if (control.hasError('invalidYear')) {
      return 'Invalid year';
    } else if (control.hasError('pattern')) {
      return 'Invalid input (incorrect format)';
    } else if (control.hasError('minlength')) {
      return 'Invalid input (number too low)';
    } else if (control.hasError('maxlength')) {
      return 'Invalid input (number too high)';
    } else {
      return 'Unknown error';
    }
  }

  public onCancel(): void {
    this.store.dispatch(MembersActions.cancelSelected());
  }

  public onSubmit(memberName: string | null): void {
    if (this.form?.invalid || !memberName) {
      this.form?.markAllAsTouched();
      return;
    }

    if (this.controlMode === 'edit') {
      this.store.dispatch(
        MembersActions.updateMemberSelected({
          memberName,
        }),
      );
    } else {
      this.store.dispatch(
        MembersActions.addMemberSelected({
          memberName,
        }),
      );
    }
  }

  private initForm(memberFormData: MemberFormData): void {
    this.form = this.formBuilder.group<MemberFormGroup<MemberFormData>>({
      firstName: new FormControl(memberFormData.firstName, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      lastName: new FormControl(memberFormData.lastName, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      city: new FormControl(memberFormData.city, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      rating: new FormControl(memberFormData.rating, {
        nonNullable: true,
        validators: [Validators.required, ratingValidator, Validators.max(3000)],
      }),
      dateJoined: new FormControl(memberFormData.dateJoined, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl(memberFormData.email, emailValidator),
      phoneNumber: new FormControl(memberFormData.phoneNumber, phoneNumberValidator),
      yearOfBirth: new FormControl(memberFormData.yearOfBirth, yearOfBirthValidator),
      chesscomUsername: new FormControl(
        memberFormData.chesscomUsername,
        Validators.pattern(/[^\s]/),
      ),
      lichessUsername: new FormControl(
        memberFormData.lichessUsername,
        Validators.pattern(/[^\s]/),
      ),
      isActive: new FormControl(memberFormData.isActive, { nonNullable: true }),
      peakRating: new FormControl(memberFormData.peakRating, { nonNullable: true }),
    });

    this.form.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe((value: Partial<MemberFormData>) =>
        this.store.dispatch(MembersActions.formValueChanged({ value })),
      );
  }

  private initFormValueChangeListener(): void {}
}
