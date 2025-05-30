import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MembersTableComponent } from '@app/components/members-table/members-table.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { Member } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { MembersSelectors } from '@app/store/members';

@UntilDestroy()
@Component({
  selector: 'lcc-members-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        title="Members"
        icon="users">
      </lcc-page-header>
      <lcc-members-table
        [activeMembers]="vm.activeMembers"
        [allMembers]="vm.allMembers"
        [displayedMembers]="vm.displayedMembers"
        [filteredMembers]="vm.filteredMembers"
        [isAdmin]="vm.isAdmin"
        [isAscending]="vm.isAscending"
        [isSafeMode]="vm.isSafeMode"
        [pageNum]="vm.pageNum"
        [pageSize]="vm.pageSize"
        [showActiveOnly]="vm.showActiveOnly"
        [sortedBy]="vm.sortedBy"
        [startIndex]="vm.startIndex">
      </lcc-members-table>
    }
  `,
  imports: [CommonModule, MembersTableComponent, PageHeaderComponent],
})
export class MembersPageComponent implements OnInit {
  viewModel$?: Observable<{
    activeMembers: Member[];
    allMembers: Member[];
    displayedMembers: Member[];
    filteredMembers: Member[];
    isAdmin: boolean;
    isAscending: boolean;
    isSafeMode: boolean;
    pageNum: number;
    pageSize: number;
    showActiveOnly: boolean;
    sortedBy: string;
    startIndex: number;
  }>;

  constructor(
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Members');
    this.metaAndTitleService.updateDescription(
      'Club ratings and other members information',
    );

    this.viewModel$ = combineLatest([
      this.store.select(MembersSelectors.selectActiveMembers),
      this.store.select(MembersSelectors.selectAllMembers),
      this.store.select(MembersSelectors.selectDisplayedMembers),
      this.store.select(MembersSelectors.selectFilteredMembers),
      this.store.select(MembersSelectors.selectIsAscending),
      this.store.select(MembersSelectors.selectPageNum),
      this.store.select(MembersSelectors.selectPageSize),
      this.store.select(MembersSelectors.selectShowActiveOnly),
      this.store.select(MembersSelectors.selectSortedBy),
      this.store.select(MembersSelectors.selectStartIndex),
      this.store.select(AuthSelectors.selectIsAdmin),
      this.store.select(AppSelectors.selectIsSafeMode),
    ]).pipe(
      untilDestroyed(this),
      map(
        ([
          activeMembers,
          allMembers,
          displayedMembers,
          filteredMembers,
          isAscending,
          pageNum,
          pageSize,
          showActiveOnly,
          sortedBy,
          startIndex,
          isAdmin,
          isSafeMode,
        ]) => ({
          activeMembers,
          allMembers,
          displayedMembers,
          filteredMembers,
          isAdmin,
          isAscending,
          isSafeMode,
          pageNum,
          pageSize,
          showActiveOnly,
          sortedBy,
          startIndex,
        }),
      ),
    );
  }
}
