import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AdminControlsComponent } from '@app/components/admin-controls/admin-controls.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PaginatorComponent } from '@app/components/paginator/paginator.component';
import { IconsModule } from '@app/icons';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { type Link, NavPathTypes } from '@app/types';
import { camelize, kebabize } from '@app/utils';

import { MembersTableFacade } from './members-table.facade';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'lcc-members-table',
  templateUrl: './members-table.component.html',
  styleUrls: ['./members-table.component.scss'],
  providers: [MembersTableFacade],
  imports: [
    AdminControlsComponent,
    CommonModule,
    FormatDatePipe,
    IconsModule,
    LinkListComponent,
    PaginatorComponent,
  ],
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
