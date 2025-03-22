import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MembersTableComponent } from '@app/components/members-table/members-table.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-members-page',
  template: `
    <lcc-page-header
      title="Members"
      icon="users">
    </lcc-page-header>
    <lcc-members-table></lcc-members-table>
  `,
  imports: [CommonModule, MembersTableComponent, PageHeaderComponent],
})
export class MembersPageComponent implements OnInit {
  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Members');
    this.metaAndTitleService.updateDescription(
      'Discover where you among other members of the London Chess Club!',
    );
  }
}
