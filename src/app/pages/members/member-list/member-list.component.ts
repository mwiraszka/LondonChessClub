import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { LoaderService } from '@app/shared/services';
import {
  angleIcon,
  ClarityIcons,
  pencilIcon,
  plusCircleIcon,
  trashIcon,
} from '@cds/core/icon';

import { MemberListFacade } from './store/member-list.facade';
import { camelize, kebabize } from '@app/shared/utils';

@Component({
  selector: 'lcc-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
  providers: [MemberListFacade],
})
export class MemberListComponent implements OnInit {
  tableHeaders = ['First Name', 'Last Name', 'City', 'Rating', 'Peak Rating'];
  adminOnlyTableHeaders = ['Phone Number', 'Date of Birth', 'Date Joined'];

  constructor(public facade: MemberListFacade, private loader: LoaderService) {}

  ngOnInit(): void {
    this.facade.loadMembers();
    this.facade.isLoading$.subscribe((isLoading) => {
      this.loader.display(isLoading);
    });
    this.facade.isAdmin$.pipe(take(1)).subscribe((isAdmin) => {
      if (isAdmin) {
        this.tableHeaders.push(...this.adminOnlyTableHeaders);
      }
    });
    ClarityIcons.addIcons(angleIcon);
    ClarityIcons.addIcons(pencilIcon);
    ClarityIcons.addIcons(plusCircleIcon);
    ClarityIcons.addIcons(trashIcon);
  }

  // Re-assign to make utils functions available in template
  camelize = camelize;
  kebabize = kebabize;
}
