import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { pick } from 'lodash';
import { debounceTime, filter, first } from 'rxjs/operators';

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

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { DatePickerComponent } from '@app/components/date-picker/date-picker.component';
import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import IconsModule from '@app/icons';
import { DialogService } from '@app/services';
import { MembersActions, MembersSelectors } from '@app/store/members';
import type {
  BasicDialogResult,
  ControlMode,
  Dialog,
  MemberFormData,
  MemberFormGroup,
} from '@app/types';
import { isDefined } from '@app/utils';
import {
  emailValidator,
  phoneNumberValidator,
  ratingValidator,
  yearOfBirthValidator,
} from '@app/validators';

import { newMemberFormTemplate } from './new-member-form-template';

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

  private controlMode: ControlMode | null = null;

  constructor(
    private readonly dialogService: DialogService<
      BasicDialogComponent,
      BasicDialogResult
    >,
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.memberFormViewModel$
      .pipe(
        filter(({ controlMode }) => isDefined(controlMode)),
        first(({ member, controlMode }) =>
          controlMode === 'add' ? true : isDefined(member),
        ),
      )
      .subscribe(({ member, memberFormData, controlMode }) => {
        if (!memberFormData) {
          memberFormData = newMemberFormTemplate;

          // Copy over form-relevant properties from selected member
          if (controlMode === 'edit' && member) {
            memberFormData = pick(
              member,
              Object.getOwnPropertyNames(memberFormData),
            ) as typeof memberFormData;
          }
        }

        this.controlMode = controlMode;
        this.initForm(memberFormData!);
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

  public async onSubmit(memberName: string | null): Promise<void> {
    if (this.form?.invalid || !memberName) {
      this.form?.markAllAsTouched();
      return;
    }

    const dialog: Dialog = {
      title: this.controlMode === 'edit' ? 'Confirm member update' : 'Confirm new member',
      body:
        this.controlMode === 'edit'
          ? `Update ${memberName}?`
          : `Add ${memberName} to database?`,
      confirmButtonText: this.controlMode === 'edit' ? 'Update' : 'Add',
    };

    const result = await this.dialogService.open({
      componentType: BasicDialogComponent,
      inputs: { dialog },
    });

    if (result !== 'confirm') {
      return;
    }

    if (this.controlMode === 'edit') {
      this.store.dispatch(MembersActions.updateMemberRequested());
    } else {
      this.store.dispatch(MembersActions.addMemberRequested());
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
      email: new FormControl(memberFormData.email, {
        nonNullable: true,
        validators: emailValidator,
      }),
      phoneNumber: new FormControl(memberFormData.phoneNumber, {
        nonNullable: true,
        validators: phoneNumberValidator,
      }),
      yearOfBirth: new FormControl(memberFormData.yearOfBirth, {
        nonNullable: true,
        validators: yearOfBirthValidator,
      }),
      chesscomUsername: new FormControl(memberFormData.chesscomUsername, {
        nonNullable: true,
        validators: Validators.pattern(/[^\s]/),
      }),
      lichessUsername: new FormControl(memberFormData.lichessUsername, {
        nonNullable: true,
        validators: Validators.pattern(/[^\s]/),
      }),
      isActive: new FormControl(memberFormData.isActive, { nonNullable: true }),
      peakRating: new FormControl(memberFormData.peakRating, { nonNullable: true }),
    });
  }

  private initFormValueChangeListener(): void {
    this.form?.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe((value: Partial<MemberFormData>) =>
        this.store.dispatch(MembersActions.formValueChanged({ value })),
      );

    // Manually trigger form value change to pass initial form data to store
    this.form?.updateValueAndValidity();
  }
}
