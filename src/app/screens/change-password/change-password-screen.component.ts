import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ChangePasswordFormComponent } from '@app/components/change-password-form/change-password-form.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-change-password-screen',
  template: `
    <lcc-screen-header title="Change Password"></lcc-screen-header>
    <lcc-change-password-form></lcc-change-password-form>
  `,
  imports: [ChangePasswordFormComponent, CommonModule, ScreenHeaderComponent],
})
export class ChangePasswordScreenComponent implements OnInit {
  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Change Password');
    this.metaAndTitleService.updateDescription(
      'Securely and conveniently change your London Chess Club password.',
    );
  }
}
