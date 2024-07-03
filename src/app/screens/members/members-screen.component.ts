import { Component, OnInit } from '@angular/core';

import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-members-screen',
  templateUrl: './members-screen.component.html',
  styleUrls: ['./members-screen.component.scss'],
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
