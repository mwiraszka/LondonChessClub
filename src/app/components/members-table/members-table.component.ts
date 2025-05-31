import { Store } from '@ngrx/store';
import { camelCase } from 'lodash';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PaginatorComponent } from '@app/components/paginator/paginator.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import IconsModule from '@app/icons';
import type {
  AdminControlsConfig,
  BasicDialogResult,
  Dialog,
  InternalLink,
  Member,
} from '@app/models';
import { CamelCasePipe, FormatDatePipe, KebabCasePipe } from '@app/pipes';
import { DialogService } from '@app/services';
import { MembersActions } from '@app/store/members';

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
  @Input({ required: true }) activeMembers!: Member[];
  @Input({ required: true }) allMembers!: Member[];
  @Input({ required: true }) displayedMembers!: Member[];
  @Input({ required: true }) filteredMembers!: Member[];
  @Input({ required: true }) isAdmin!: boolean;
  @Input({ required: true }) isAscending!: boolean;
  @Input({ required: true }) isSafeMode!: boolean;
  @Input({ required: true }) pageNum!: number;
  @Input({ required: true }) pageSize!: number;
  @Input({ required: true }) showActiveOnly!: boolean;
  @Input({ required: true }) sortedBy!: string;
  @Input({ required: true }) startIndex!: number;

  public readonly addMemberLink: InternalLink = {
    internalPath: ['member', 'add'],
    text: 'Add a member',
    icon: 'plus-circle',
  };

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
    private readonly dialogService: DialogService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
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
      itemName: `${member.firstName} ${member.lastName}`,
      deleteCb: () => this.onDeleteMember(member),
    };
  }

  private async onDeleteMember(member: Member): Promise<void> {
    const dialog: Dialog = {
      title: 'Delete member',
      body: `Delete ${member.firstName} ${member.lastName}?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open<BasicDialogComponent, BasicDialogResult>(
      {
        componentType: BasicDialogComponent,
        inputs: { dialog },
        isModal: true,
      },
    );

    if (result === 'confirm') {
      this.store.dispatch(MembersActions.deleteMemberRequested({ member }));
    }
  }
}
