import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';

import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { DatePickerComponent } from '@app/components/date-picker/date-picker.component';
import { FormErrorIconComponent } from '@app/components/form-error-icon/form-error-icon.component';
import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { SafeModeNoticeComponent } from '@app/components/safe-mode-notice/safe-mode-notice.component';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import type {
  BasicDialogResult,
  Dialog,
  Member,
  MemberFormData,
  MemberFormGroup,
} from '@app/models';
import { DialogService } from '@app/services';
import { MembersActions } from '@app/store/members';
import {
  emailValidator,
  phoneNumberValidator,
  ratingValidator,
  yearOfBirthValidator,
} from '@app/validators';

@UntilDestroy()
@Component({
  selector: 'lcc-member-form',
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.scss',
  imports: [
    DatePickerComponent,
    FormErrorIconComponent,
    MatIconModule,
    ModificationInfoComponent,
    ReactiveFormsModule,
    SafeModeNoticeComponent,
    TooltipDirective,
  ],
})
export class MemberFormComponent implements OnInit {
  @Input({ required: true }) formData!: MemberFormData;
  @Input({ required: true }) hasUnsavedChanges!: boolean;
  @Input({ required: true }) isSafeMode!: boolean;
  @Input({ required: true }) originalMember!: Member | null;

  public form!: FormGroup<MemberFormGroup>;

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

  public async onRestore(): Promise<void> {
    const dialog: Dialog = {
      title: 'Confirm',
      body: 'Restore original member data? All changes will be lost.',
      confirmButtonText: 'Restore',
      confirmButtonType: 'warning',
    };

    const dialogResult = await this.dialogService.open<
      BasicDialogComponent,
      BasicDialogResult
    >({
      componentType: BasicDialogComponent,
      inputs: { dialog },
      isModal: false,
    });

    if (dialogResult !== 'confirm') {
      return;
    }

    const memberId = this.originalMember?.id ?? null;
    this.store.dispatch(MembersActions.memberFormDataReset({ memberId }));

    setTimeout(() => this.ngOnInit());
  }

  public onCancel(): void {
    this.store.dispatch(MembersActions.cancelSelected());
  }

  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dialog: Dialog = {
      title: 'Confirm',
      body: this.originalMember
        ? `Update ${this.originalMember.firstName} ${this.originalMember.lastName}?`
        : `Add ${this.formData.firstName} ${this.formData.lastName}?`,
      confirmButtonText: this.originalMember ? 'Update' : 'Add',
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

    if (this.originalMember) {
      this.store.dispatch(
        MembersActions.updateMemberRequested({ memberId: this.originalMember.id }),
      );
    } else {
      this.store.dispatch(MembersActions.addMemberRequested());
    }
  }

  private initForm(formData: MemberFormData): void {
    this.form = this.formBuilder.group<MemberFormGroup>({
      firstName: new FormControl(formData.firstName, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      lastName: new FormControl(formData.lastName, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      city: new FormControl(formData.city, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      rating: new FormControl(formData.rating, {
        nonNullable: true,
        validators: [Validators.required, ratingValidator],
      }),
      dateJoined: new FormControl(formData.dateJoined, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl(formData.email, {
        nonNullable: true,
        validators: emailValidator,
      }),
      phoneNumber: new FormControl(formData.phoneNumber, {
        nonNullable: true,
        validators: phoneNumberValidator,
      }),
      yearOfBirth: new FormControl(formData.yearOfBirth, {
        nonNullable: true,
        validators: yearOfBirthValidator,
      }),
      chessComUsername: new FormControl(formData.chessComUsername, {
        nonNullable: true,
        validators: Validators.pattern(/[^\s]/),
      }),
      lichessUsername: new FormControl(formData.lichessUsername, {
        nonNullable: true,
        validators: Validators.pattern(/[^\s]/),
      }),
      isActive: new FormControl(formData.isActive, { nonNullable: true }),
      peakRating: new FormControl(formData.peakRating, { nonNullable: true }),
    });
  }

  private initFormValueChangeListener(): void {
    this.form?.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe((value: Partial<MemberFormData>) =>
        this.store.dispatch(
          MembersActions.formValueChanged({
            memberId: this.originalMember?.id ?? null,
            value,
          }),
        ),
      );

    // Manually trigger form value change to pass initial form data to store
    this.form?.updateValueAndValidity();
  }
}
