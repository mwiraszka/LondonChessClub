import { Store } from '@ngrx/store';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { LoginFormComponent } from '@app/components/login-form/login-form.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { MetaAndTitleService } from '@app/services';
import { AuthActions } from '@app/store/auth';

@Component({
  selector: 'lcc-login-page',
  template: `
    <lcc-page-header heading="Admin Login"></lcc-page-header>
    <lcc-login-form (requestLogin)="onRequestLogin($event)"></lcc-login-form>
  `,
  imports: [LoginFormComponent, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  constructor(
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Log In');
    this.metaAndTitleService.updateDescription(
      'Log in to your London Chess Club admin account',
    );
  }

  public onRequestLogin(credentials: { email: string; password: string }): void {
    this.store.dispatch(AuthActions.loginRequested(credentials));
  }
}
