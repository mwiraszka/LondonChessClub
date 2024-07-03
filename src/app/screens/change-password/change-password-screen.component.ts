import { Component, OnInit } from '@angular/core';

import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-change-password-screen',
  templateUrl: './change-password-screen.component.html',
  styleUrls: ['./change-password-screen.component.scss'],
})
export class ChangePasswordScreenComponent implements OnInit {
  constructor(private metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Change Password');
    this.metaAndTitleService.updateDescription(
      'Securely and conveniently change your London Chess Club password.'
    );
  }
}
