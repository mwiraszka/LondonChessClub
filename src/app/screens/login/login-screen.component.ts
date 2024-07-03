import { Component, OnInit } from '@angular/core';

import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss'],
})
export class LoginScreenComponent implements OnInit {
  constructor(private metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Log In');
    this.metaAndTitleService.updateDescription(
      'Log in to your London Chess Club admin account',
    );
  }
}
