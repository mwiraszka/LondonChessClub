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
    path: NavPathTypes.MEMBER_ADD,
    text: 'Add new member',
    icon: 'plus-circle',
  };

  constructor(public facade: MembersTableFacade) {}

  ngOnInit(): void {
    this.facade.fetchMembers();

    this.facade.isAdmin$.pipe(untilDestroyed(this)).subscribe(isAdmin => {
      this.tableHeaders = isAdmin
        ? this.ALL_TABLE_HEADERS
        : this.ALL_TABLE_HEADERS.slice(0, -4);
    });
  }

  convertToUtcTimezone(localDate: string): string {
    // Since we are only concerned with the day and since UTC @ 12:00am
    // is always a day ahead of local time, we can simply add one day
    return moment(localDate).add(1, 'days').toISOString().split('T')[0];
  }
}
