import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AdminControlsComponent } from '@app/components/admin-controls/admin-controls.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PaginatorComponent } from '@app/components/paginator/paginator.component';
import { IconsModule } from '@app/icons';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { MembersActions, MembersSelectors } from '@app/store/members';
import { type Link, Member, NavPathTypes } from '@app/types';
import { camelize, kebabize } from '@app/utils';

@Component({
  selector: 'lcc-members-table',
  templateUrl: './members-table.component.html',
  styleUrl: './members-table.component.scss',
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
  public readonly NavPathTypes = NavPathTypes;
  public readonly camelize = camelize;
  public readonly kebabize = kebabize;

  public readonly addMemberLink: Link = {
    path: NavPathTypes.MEMBER + '/' + NavPathTypes.ADD,
    text: 'Add a member',
    icon: 'plus-circle',
  };
  public readonly membersTableViewModel$ = this.store.select(
    MembersSelectors.selectMembersTableViewModel,
  );
  public readonly tableHeaders = [
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

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.fetchMembers();
  }

  public fetchMembers(): void {
    this.store.dispatch(MembersActions.fetchMembersRequested());
  }

  public onDeleteMember(member: Member): void {
    this.store.dispatch(MembersActions.deleteMemberSelected({ member }));
  }

  public onSelectTableHeader(header: string): void {
    this.store.dispatch(MembersActions.tableHeaderSelected({ header }));
  }

  public onToggleInactiveMembers(): void {
    this.store.dispatch(MembersActions.inactiveMembersToggled());
  }

  public onChangePage(pageNum: number): void {
    this.store.dispatch(MembersActions.pageChanged({ pageNum }));
  }

  public onChangePageSize(pageSize: number): void {
    this.store.dispatch(MembersActions.pageSizeChanged({ pageSize }));
  }
}
