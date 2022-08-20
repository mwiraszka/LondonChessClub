import { Component, OnInit, ViewChild } from '@angular/core';
import { angleIcon, ClarityIcons } from '@cds/core/icon';
import { take } from 'rxjs/operators';

import { LoaderService } from '@app/shared/services';
import { PaginatorComponent } from '@app/shared/components/paginator';
import { Link, NavPathTypes } from '@app/shared/types';
import { camelize, kebabize } from '@app/shared/utils';

import { MemberListScreenFacade } from './member-list-screen.facade';

@Component({
  selector: 'lcc-member-list-screen',
  templateUrl: './member-list-screen.component.html',
  styleUrls: ['./member-list-screen.component.scss'],
  providers: [MemberListScreenFacade],
})
export class MemberListScreenComponent implements OnInit {
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

  showActiveOnly = false;
  from = 0;
  to = 10;

  tableHeaders = [
    'First Name',
    'Last Name',
    'Rating',
    'Peak Rating',
    'City',
    'Born',
    'Chess.com Username',
    'Lichess Username',
  ];

  adminOnlyTableHeaders = ['Email', 'Phone Number', 'Date Joined'];

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

  onUpdateRange([from, to]: [number, number]): void {
    this.from = from;
    this.to = to;
  }

  onToggleShowActiveOnly(): void {
    this.showActiveOnly = !this.showActiveOnly;
    this.paginator.onFirst();
  }

  // Re-assign to make utils functions available in template
  camelize = camelize;
  kebabize = kebabize;
}
