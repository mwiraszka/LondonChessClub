import { Component, OnInit } from '@angular/core';
import { angleIcon, ClarityIcons } from '@cds/core/icon';
import { take } from 'rxjs/operators';

import { LoaderService } from '@app/shared/services';
import { Link, MOCK_MEMBERS } from '@app/shared/types';
import { camelize, kebabize } from '@app/shared/utils';

import { MemberListScreenFacade } from './member-list-screen.facade';
import { NavPathTypes } from '@app/core/nav';

@Component({
  selector: 'lcc-member-list-screen',
  templateUrl: './member-list-screen.component.html',
  styleUrls: ['./member-list-screen.component.scss'],
  providers: [MemberListScreenFacade],
})
export class MemberListScreenComponent implements OnInit {
  MOCK_MEMBERS = MOCK_MEMBERS;

  tableHeaders = ['First Name', 'Last Name', 'City', 'Rating', 'Peak Rating'];
  adminOnlyTableHeaders = ['Phone Number', 'Date of Birth', 'Date Joined'];

  addMemberLink: Link = {
    path: NavPathTypes.MEMBERS_ADD,
    text: 'Add new member',
    iconShape: 'plus-circle',
  };

  constructor(public facade: MemberListScreenFacade, private loader: LoaderService) {}

  ngOnInit(): void {
    this.facade.isLoading$.subscribe((isLoading) => {
      this.loader.display(isLoading);
    });
    this.facade.loadMembers();
    this.facade.isAdmin$.pipe(take(1)).subscribe((isAdmin) => {
      if (isAdmin) {
        this.tableHeaders.push(...this.adminOnlyTableHeaders);
      }
    });

    ClarityIcons.addIcons(angleIcon);
  }

  // Re-assign to make utils functions available in template
  camelize = camelize;
  kebabize = kebabize;
}
