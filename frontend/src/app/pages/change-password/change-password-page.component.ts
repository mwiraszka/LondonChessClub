import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ChangePasswordFormComponent } from '@app/components/change-password-form/change-password-form.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { MetaAndTitleService } from '@app/services';
import { AuthActions, AuthSelectors } from '@app/store/auth';

@UntilDestroy()
@Component({
  selector: 'lcc-change-password-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header heading="Change Password"></lcc-page-header>
      <lcc-change-password-form
        [hasCode]="vm.hasCode"
        (requestChangePassword)="onRequestChangePassword($event)"
        (requestCodeForPasswordChange)="onRequestCodeForPasswordChange($event)"
        (requestNewCode)="onRequestNewCode()">
      </lcc-change-password-form>
    }
  `,
  imports: [ChangePasswordFormComponent, CommonModule, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordPageComponent implements OnInit {
  public viewModel$?: Observable<{ hasCode: boolean }>;

  constructor(
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Change Password');
    this.metaAndTitleService.updateDescription(
      'Securely and conveniently change your London Chess Club password.',
    );

    this.viewModel$ = this.store.select(AuthSelectors.selectHasCode).pipe(
      untilDestroyed(this),
      map(hasCode => ({ hasCode })),
    );
  }

  public onRequestChangePassword(credentials: {
    email: string;
    password: string;
    code: string;
  }): void {
    this.store.dispatch(AuthActions.passwordChangeRequested(credentials));
  }

  public onRequestCodeForPasswordChange(email: string): void {
    this.store.dispatch(AuthActions.codeForPasswordChangeRequested({ email }));
  }

  public onRequestNewCode(): void {
    this.store.dispatch(AuthActions.requestNewCodeSelected());
  }
}
