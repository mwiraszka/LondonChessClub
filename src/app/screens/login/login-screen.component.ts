import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { LoginFormComponent } from '@app/components/login-form/login-form.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-login-screen',
  template: `
    <lcc-screen-header title="Admin Login"></lcc-screen-header>
    <lcc-login-form></lcc-login-form>
  `,
  imports: [CommonModule, LoginFormComponent, ScreenHeaderComponent],
})
export class LoginScreenComponent implements OnInit {
  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Log In');
    this.metaAndTitleService.updateDescription(
      'Log in to your London Chess Club admin account',
    );
  }
}
