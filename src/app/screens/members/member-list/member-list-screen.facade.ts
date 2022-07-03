import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as AuthSelectors from '@app/core/auth/store/auth.selectors';

import * as MemberListScreenActions from './store/member-list-screen.actions';
import * as MemberListScreenSelectors from './store/member-list-screen.selectors';
import { Member } from '../types/member.model';

@Injectable()
export class MemberListScreenFacade {
  readonly members$ = this.store.select(MemberListScreenSelectors.members);
  readonly isLoading$ = this.store.select(MemberListScreenSelectors.isLoading);
  readonly isAdmin$ = this.store.select(AuthSelectors.isAdmin);
  readonly sortedBy$ = this.store.select(MemberListScreenSelectors.sortedBy);
  readonly isAscending$ = this.store.select(MemberListScreenSelectors.isAscending);

  constructor(private readonly store: Store) {}

  loadMembers(): void {
    this.store.dispatch(MemberListScreenActions.loadMembersStarted());
  }

  onSelectTableHeader(header: string): void {
    this.store.dispatch(MemberListScreenActions.tableHeaderSelected({ header }));
  }

  onAddMember(): void {
    this.store.dispatch(MemberListScreenActions.createMemberSelected());
  }

  onEditMember(memberToEdit: Member): void {
    this.store.dispatch(MemberListScreenActions.editMemberSelected({ memberToEdit }));
  }

  onDeleteMember(memberToDelete: Member): void {
    this.store.dispatch(MemberListScreenActions.deleteMemberSelected({ memberToDelete }));
  }
}
