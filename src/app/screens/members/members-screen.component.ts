import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MembersTableComponent } from '@app/components/members-table/members-table.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  standalone: true,
  selector: 'lcc-members-screen',
  templateUrl: './members-screen.component.html',
  styleUrls: ['./members-screen.component.scss'],
  imports: [CommonModule, MembersTableComponent, ScreenHeaderComponent],
})
export class MembersScreenComponent implements OnInit {
  constructor(private metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Members');
    this.metaAndTitleService.updateDescription(
      'Discover where you among other members of the London Chess Club!',
    );
  }
}
