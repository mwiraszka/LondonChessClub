import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, first, tap } from 'rxjs/operators';

import { LoaderService } from '@app/shared/services';
import {
  dateValidator,
  emailValidator,
  phoneNumberValidator,
} from '@app/shared/validators';

import { MemberEditorFacade } from './store/member-editor.facade';
import { Member } from '../types/member.model';

@Component({
  selector: 'lcc-member-editor',
  templateUrl: './member-editor.component.html',
  styleUrls: ['./member-editor.component.scss'],
  providers: [MemberEditorFacade],
})
export class MemberEditorComponent implements OnInit, OnDestroy {
  readonly title = 'memberEditor';

  form!: FormGroup;
  valueChangesSubscription!: Subscription;

  constructor(
    public facade: MemberEditorFacade,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loader.display(true);
    this.facade.memberBeforeEdit$
      .pipe(
        tap((member) => this.initForm(member)),
        tap(() => this.loader.display(false)),
        first()
      )
      .subscribe();

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('memberId')) {
        console.log('::: paramMap has memberId');
      }
    });
  }

  ngOnDestroy(): void {
    this.valueChangesSubscription.unsubscribe();
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
      phoneNumber: [member.phoneNumber, phoneNumberValidator],
      email: [member.email, [Validators.required, emailValidator]],
      dateJoined: [member.dateJoined, [Validators.required, dateValidator]],
      rating: [
        member.rating,
        [Validators.required, Validators.pattern(/^[1-9]\d{0,3}$/), Validators.max(2500)],
      ],
    });

    this.valueChangesSubscription = this.form.valueChanges
      .pipe(debounceTime(200))
      .subscribe((member: Member) => this.facade.onValueChange(member));
  }
}
