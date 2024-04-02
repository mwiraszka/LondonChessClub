import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { AuthSelectors } from '@app/store/auth';
import { MembersActions, MembersSelectors } from '@app/store/members';
import type { Member } from '@app/types';

@Injectable()
export class MembersTableFacade {
  readonly isAdmin$ = this.store.select(AuthSelectors.isAdmin);

  readonly members$ = this.store.select(MembersSelectors.members);
  readonly activeMembers$ = this.store.select(MembersSelectors.activeMembers);
  readonly filteredMembers$ = this.store.select(MembersSelectors.filteredMembers);
  readonly displayedMembers$ = this.store.select(MembersSelectors.displayedMembers);

  readonly isAscending$ = this.store.select(MembersSelectors.isAscending);
  readonly sortedBy$ = this.store.select(MembersSelectors.sortedBy);
  readonly pageNum$ = this.store.select(MembersSelectors.pageNum);
  readonly pageSize$ = this.store.select(MembersSelectors.pageSize);
  readonly startIndex$ = this.store.select(MembersSelectors.startIndex);
  readonly showActiveOnly$ = this.store.select(MembersSelectors.showActiveOnly);

  constructor(private readonly store: Store) {}

  fetchMembers(): void {
    this.store.dispatch(MembersActions.fetchMembersRequested());
  }

  onDeleteMember(memberToDelete: Member): void {
    this.store.dispatch(MembersActions.deleteMemberSelected({ memberToDelete }));
  }

  onSelectTableHeader(header: string): void {
    this.store.dispatch(MembersActions.tableHeaderSelected({ header }));
  }

  onToggleInactiveMembers(): void {
    this.store.dispatch(MembersActions.inactiveMembersToggled());
  }

  onChangePage(pageNum: number): void {
    this.store.dispatch(MembersActions.pageChanged({ pageNum }));
  }

  onChangePageSize(pageSize: number): void {
    this.store.dispatch(MembersActions.pageSizeChanged({ pageSize }));
  }
}
