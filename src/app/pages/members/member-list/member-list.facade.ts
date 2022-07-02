import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as AuthSelectors from '@app/core/auth/store/auth.selectors';

import * as MemberListActions from './store/member-list.actions';
import * as MemberListSelectors from './store/member-list.selectors';
import { Member } from '../types/member.model';

@Injectable()
export class MemberListFacade {
  readonly members$ = this.store.select(MemberListSelectors.members);
  readonly isLoading$ = this.store.select(MemberListSelectors.isLoading);
  readonly isAdmin$ = this.store.select(AuthSelectors.isAdmin);
  readonly sortedBy$ = this.store.select(MemberListSelectors.sortedBy);
  readonly isAscending$ = this.store.select(MemberListSelectors.isAscending);

  constructor(private readonly store: Store) {}

  loadMembers(): void {
    this.store.dispatch(MemberListActions.loadMembersStarted());
  }

  onSelectTableHeader(header: string): void {
    this.store.dispatch(MemberListActions.tableHeaderSelected({ header }));
  }

  onAddMember(): void {
    this.store.dispatch(MemberListActions.createMemberSelected());
  }

  onEditMember(memberToEdit: Member): void {
    this.store.dispatch(MemberListActions.editMemberSelected({ memberToEdit }));
  }

  onDeleteMember(memberToDelete: Member): void {
    this.store.dispatch(MemberListActions.deleteMemberSelected({ memberToDelete }));
  }
}
