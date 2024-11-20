import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import moment from 'moment-timezone';

import { Component, OnInit } from '@angular/core';

import { type Link, NavPathTypes } from '@app/types';
import { camelize, kebabize } from '@app/utils';

import { MembersTableFacade } from './members-table.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-members-table',
  templateUrl: './members-table.component.html',
  styleUrls: ['./members-table.component.scss'],
  providers: [MembersTableFacade],
})
export class MembersTableComponent implements OnInit {
  readonly NavPathTypes = NavPathTypes;
  readonly camelize = camelize;
  readonly kebabize = kebabize;

  readonly ALL_TABLE_HEADERS = [
    'First Name',
    'Last Name',
    'Rating',
    'Peak Rating',
    'City',
    'Chess.com Username',
    'Lichess Username',
    'Last Updated',
    'Born',
    'Email',
    'Phone Number',
    'Date Joined',
  ];

  tableHeaders!: string[];
  addMemberLink: Link = {
    path: NavPathTypes.MEMBER + '/' + NavPathTypes.ADD,
    text: 'Add a member',
    icon: 'plus-circle',
  };

  constructor(public facade: MembersTableFacade) {}

  ngOnInit(): void {
    this.facade.fetchMembers();

    this.facade.showAdminColumns$
      .pipe(untilDestroyed(this))
      .subscribe(showAdminColumns => {
        this.tableHeaders = showAdminColumns
          ? this.ALL_TABLE_HEADERS
          : this.ALL_TABLE_HEADERS.slice(0, -4);
      });
  }

  // TODO: update to work with Date objects!
  convertToUtcTimezone(localDate: Date): Date {
    return localDate;
  }
}
