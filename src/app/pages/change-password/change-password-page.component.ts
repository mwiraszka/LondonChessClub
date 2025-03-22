import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ChangePasswordFormComponent } from '@app/components/change-password-form/change-password-form.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-change-password-page',
  template: `
    <lcc-page-header title="Change Password"></lcc-page-header>
    <lcc-change-password-form></lcc-change-password-form>
  `,
  imports: [ChangePasswordFormComponent, CommonModule, PageHeaderComponent],
})
export class ChangePasswordPageComponent implements OnInit {
  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Change Password');
    this.metaAndTitleService.updateDescription(
      'Securely and conveniently change your London Chess Club password.',
    );
  }
}
