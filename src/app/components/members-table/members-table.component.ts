import { Store } from '@ngrx/store';
import { camelCase } from 'lodash';
import { take } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { SafeModeNoticeComponent } from '@app/components/safe-mode-notice/safe-mode-notice.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import type {
  AdminControlsConfig,
  BasicDialogResult,
  Dialog,
  InternalLink,
  Member,
} from '@app/models';
import { CamelCasePipe, FormatDatePipe, KebabCasePipe } from '@app/pipes';
import { DialogService } from '@app/services';
import { MembersActions, MembersSelectors } from '@app/store/members';
import { isSecondsInPast } from '@app/utils';

@Component({
  selector: 'lcc-members-table',
  templateUrl: './members-table.component.html',
  styleUrl: './members-table.component.scss',
  imports: [
    AdminControlsDirective,
    CamelCasePipe,
    CommonModule,
    FormatDatePipe,
    KebabCasePipe,
    LinkListComponent,
    MatIconModule,
    RouterLink,
    SafeModeNoticeComponent,
    TooltipDirective,
  ],
})
export class MembersTableComponent implements OnInit {
  @Input({ required: true }) filteredMembers!: Member[];
  @Input({ required: true }) isAdmin!: boolean;
  @Input({ required: true }) isAscending!: boolean;
  @Input({ required: true }) isSafeMode!: boolean;
  @Input({ required: true }) sortedBy!: string;
  @Input({ required: true }) totalMemberCount!: number;

  public readonly DEFAULT_TABLE_HEADERS = [
    'Name',
    'Rating',
    'Peak Rating',
    'City',
    'Chess.com Username',
    'Lichess Username',
  ];

  public readonly ADMIN_TABLE_HEADERS = [
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

  public readonly addMemberLink: InternalLink = {
    internalPath: ['member', 'add'],
    text: 'Add a member',
    icon: 'add_circle_outline',
  };

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.store
      .select(MembersSelectors.selectLastFetch)
      .pipe(take(1))
      .subscribe(lastFetch => {
        if (!lastFetch || isSecondsInPast(lastFetch, 600)) {
          this.store.dispatch(MembersActions.fetchMembersRequested());
        }
      });
  }

  public onSelectTableHeader(headerLabel: string): void {
    // TODO: clean up
    const header = camelCase(headerLabel) as keyof Member;
    this.store.dispatch(MembersActions.tableHeaderSelected({ header }));
  }

  public getAdminControlsConfig(member: Member): AdminControlsConfig {
    return {
      editPath: ['member', 'edit', member.id!],
      buttonSize: 31,
      itemName: `${member.firstName} ${member.lastName}`,
      deleteCb: () => this.onDeleteMember(member),
    };
  }

  public isCityChampion(member: Member): boolean {
    return member.firstName === 'Serhii' && member.lastName === 'Ivanchuk';
  }

  private async onDeleteMember(member: Member): Promise<void> {
    const dialog: Dialog = {
      title: 'Confirm',
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
