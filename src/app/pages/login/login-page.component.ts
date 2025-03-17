import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { LoginFormComponent } from '@app/components/login-form/login-form.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-login-page',
  template: `
    <lcc-page-header title="Admin Login"></lcc-page-header>
    <lcc-login-form></lcc-login-form>
  `,
  imports: [CommonModule, LoginFormComponent, PageHeaderComponent],
})
export class LoginPageComponent implements OnInit {
  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Log In');
    this.metaAndTitleService.updateDescription(
      'Log in to your London Chess Club admin account',
    );
  }
}
