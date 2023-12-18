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
}
