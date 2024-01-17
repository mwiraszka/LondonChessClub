import moment from 'moment';

import { Component, OnInit } from '@angular/core';

import { LoaderService } from '@app/services';
import { Link, Member, NavPathTypes } from '@app/types';
import { camelize, kebabize } from '@app/utils';

import { MembersTableFacade } from './members-table.facade';

@Component({
  selector: 'lcc-members-table',
  templateUrl: './members-table.component.html',
  styleUrls: ['./members-table.component.scss'],
  providers: [MembersTableFacade],
})
export class MembersTableComponent implements OnInit {
  NavPathTypes = NavPathTypes;
  camelize = camelize;
  kebabize = kebabize;

  tableHeaders = [
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

  addMemberLink: Link = {
    path: NavPathTypes.MEMBER_ADD,
    text: 'Add new member',
    iconShape: 'plus-circle',
  };

  constructor(public facade: MembersTableFacade, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.facade.isLoading$.subscribe(isLoading => {
      this.loaderService.display(isLoading);
    });
    this.facade.loadMembers();
  }

  trackByFn = (index: number, member: Member) => member.id;

  convertToUtcTimezone(localDate: string): string {
    // Since we are only concerned with the day and since UTC @ 12:00am
    // is always a day ahead of local time, we can simply add one day
    return moment(localDate).add(1, 'days').toISOString().split('T')[0];
  }
}
