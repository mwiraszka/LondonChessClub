import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ChangePasswordFormComponent } from '@app/components/change-password-form/change-password-form.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-change-password-screen',
  templateUrl: './change-password-screen.component.html',
  styleUrls: ['./change-password-screen.component.scss'],
  imports: [CommonModule, ChangePasswordFormComponent, ScreenHeaderComponent],
})
export class ChangePasswordScreenComponent implements OnInit {
  constructor(private metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Change Password');
    this.metaAndTitleService.updateDescription(
      'Securely and conveniently change your London Chess Club password.',
    );
  }
}
