import { Store } from '@ngrx/store';
import { camelCase } from 'lodash';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AdminControlsDirective } from '@app/components/admin-controls/admin-controls.directive';
import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PaginatorComponent } from '@app/components/paginator/paginator.component';
import IconsModule from '@app/icons';
import { CamelCasePipe, FormatDatePipe, KebabCasePipe } from '@app/pipes';
import { DialogService } from '@app/services';
import { MembersActions, MembersSelectors } from '@app/store/members';
import type {
  AdminControlsConfig,
  BasicDialogResult,
  Dialog,
  InternalLink,
  Member,
} from '@app/types';

@Component({
  selector: 'lcc-members-table',
  templateUrl: './members-table.component.html',
  styleUrl: './members-table.component.scss',
  imports: [
    AdminControlsDirective,
    CamelCasePipe,
    CommonModule,
    FormatDatePipe,
    IconsModule,
    KebabCasePipe,
    LinkListComponent,
    PaginatorComponent,
  ],
})
export class MembersTableComponent implements OnInit {
  public readonly addMemberLink: InternalLink = {
    internalPath: ['member', 'add'],
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

  constructor(
    private readonly dialogService: DialogService<
      BasicDialogComponent,
      BasicDialogResult
    >,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.fetchMembers();
  }

  public fetchMembers(): void {
    this.store.dispatch(MembersActions.fetchMembersRequested());
  }

  public onSelectTableHeader(header: string): void {
    header = camelCase(header);
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

  public getAdminControlsConfig(member: Member): AdminControlsConfig {
    return {
      editPath: ['member', 'edit', member.id!],
      buttonSize: 31,
      itemName: member.firstName,
      deleteCb: () => this.onDeleteMember(member),
    };
  }

  private async onDeleteMember(member: Member): Promise<void> {
    const dialog: Dialog = {
      title: 'Confirm member deletion',
      body: `Delete ${member.firstName} ${member.lastName}?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open({
      componentType: BasicDialogComponent,
      inputs: { dialog },
    });

    if (result === 'confirm') {
      this.store.dispatch(MembersActions.deleteMemberRequested({ member }));
    }
  }
}
