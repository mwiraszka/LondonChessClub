import { UntilDestroy } from '@ngneat/until-destroy';
import { camelCase } from 'lodash';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { SafeModeNoticeComponent } from '@app/components/safe-mode-notice/safe-mode-notice.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import type {
  AdminControlsConfig,
  BasicDialogResult,
  DataPaginationOptions,
  Dialog,
  Member,
} from '@app/models';
import { CamelCasePipe, FormatDatePipe, KebabCasePipe } from '@app/pipes';
import { DialogService } from '@app/services';

@UntilDestroy()
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
    MatIconModule,
    RouterLink,
    SafeModeNoticeComponent,
    TooltipDirective,
  ],
})
export class MembersTableComponent {
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

  @Input({ required: true }) isAdmin!: boolean;
  @Input({ required: true }) options!: DataPaginationOptions<Member>;
  @Input({ required: true }) isSafeMode!: boolean;
  @Input({ required: true }) members!: Member[];

  @Output() public requestDeleteMember = new EventEmitter<Member>();
  @Output() public optionsChange = new EventEmitter<DataPaginationOptions<Member>>();

  public get startIndex(): number {
    return this.options.pageSize * (this.options.page - 1) + 1;
  }

  constructor(private readonly dialogService: DialogService) {}

  public onSelectTableHeader(headerLabel: string): void {
    const header = camelCase(headerLabel) as keyof Member;
    const isSameHeader = this.options.sortBy === header;

    let sortOrder: 'asc' | 'desc';

    if (isSameHeader) {
      sortOrder = this.options.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortOrder = ['rating', 'peakRating'].includes(header) ? 'desc' : 'asc';
    }

    this.optionsChange.emit({
      ...this.options,
      sortBy: header,
      sortOrder,
    });
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
      this.requestDeleteMember.emit(member);
    }
  }
}
