import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { LoaderService } from '@app/shared/services';
import {
  angleIcon,
  ClarityIcons,
  pencilIcon,
  plusCircleIcon,
  trashIcon,
  usersIcon,
} from '@cds/core/icon';

import { MemberListScreenFacade } from './member-list-screen.facade';
import { camelize, kebabize } from '@app/shared/utils';

@Component({
  selector: 'lcc-member-list-screen',
  templateUrl: './member-list-screen.component.html',
  styleUrls: ['./member-list-screen.component.scss'],
  providers: [MemberListScreenFacade],
})
export class MemberListScreenComponent implements OnInit {
  tableHeaders = ['First Name', 'Last Name', 'City', 'Rating', 'Peak Rating'];
  adminOnlyTableHeaders = ['Phone Number', 'Date of Birth', 'Date Joined'];

  constructor(public facade: MemberListScreenFacade, private loader: LoaderService) {}

  ngOnInit(): void {
    this.facade.isLoading$.subscribe((isLoading) => {
      this.loader.display(isLoading);
    });
    this.facade.loadMembers();
    ClarityIcons.addIcons(angleIcon, pencilIcon, plusCircleIcon, trashIcon, usersIcon);
    this.facade.isAdmin$.pipe(take(1)).subscribe((isAdmin) => {
      if (isAdmin) {
        this.tableHeaders.push(...this.adminOnlyTableHeaders);
      }
    });
  }

  // Re-assign to make utils functions available in template
  camelize = camelize;
  kebabize = kebabize;
}
