import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MembersTableComponent } from '@app/components/members-table/members-table.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-members-screen',
  template: `
    <lcc-screen-header
      title="Members"
      icon="users">
    </lcc-screen-header>
    <lcc-members-table></lcc-members-table>
  `,
  imports: [CommonModule, MembersTableComponent, ScreenHeaderComponent],
})
export class MembersScreenComponent implements OnInit {
  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Members');
    this.metaAndTitleService.updateDescription(
      'Discover where you among other members of the London Chess Club!',
    );
  }
}
