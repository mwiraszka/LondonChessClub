import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { debounceTime, first } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import { MembersActions, MembersSelectors } from '@app/store/members';
import type { ControlMode, MemberFormData } from '@app/types';
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
  styleUrls: ['./member-form.component.scss'],
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
  public form: FormGroup | null = null;

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
    this.form = this.formBuilder.group({
      firstName: [
        memberFormData.firstName,
        [Validators.required, Validators.pattern(/[^\s]/)],
      ],
      lastName: [
        memberFormData.lastName,
        [Validators.required, Validators.pattern(/[^\s]/)],
      ],
      city: [memberFormData.city, [Validators.required, Validators.pattern(/[^\s]/)]],
      rating: [
        memberFormData.rating,
        [Validators.required, ratingValidator, Validators.max(3000)],
      ],
      dateJoined: [memberFormData.dateJoined, [Validators.required]],
      email: [memberFormData.email, emailValidator],
      phoneNumber: [memberFormData.phoneNumber, phoneNumberValidator],
      yearOfBirth: [memberFormData.yearOfBirth, yearOfBirthValidator],
      chesscomUsername: [memberFormData.chesscomUsername, Validators.pattern(/[^\s]/)],
      lichessUsername: [memberFormData.lichessUsername, Validators.pattern(/[^\s]/)],
      isActive: [memberFormData.isActive],
      peakRating: [memberFormData.peakRating],
    });
  }

  private initFormValueChangeListener(): void {
    this.form?.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe((memberFormData: MemberFormData) =>
        this.store.dispatch(MembersActions.formDataChanged({ memberFormData })),
      );
  }
}
