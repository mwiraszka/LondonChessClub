import { Component, OnInit, ViewChild } from '@angular/core';
import { angleIcon, ClarityIcons } from '@cds/core/icon';
import { take } from 'rxjs/operators';

import { PaginatorComponent } from '@app/components/paginator';
import { LoaderService } from '@app/services';
import { Link, NavPathTypes } from '@app/types';
import { camelize, kebabize } from '@app/utils';

import { MembersTableFacade } from './members-table.facade';

@Component({
  selector: 'lcc-members-table',
  templateUrl: './members-table.component.html',
  styleUrls: ['./members-table.component.scss'],
  providers: [MembersTableFacade],
})
export class MembersTableComponent implements OnInit {
  camelize = camelize;
  kebabize = kebabize;
  showActiveOnly = true;
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
    path: NavPathTypes.MEMBER_ADD,
    text: 'Add new member',
    iconShape: 'plus-circle',
  };

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

  constructor(public facade: MembersTableFacade, private loader: LoaderService) {}

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
}
