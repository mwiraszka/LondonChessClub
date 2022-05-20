import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as MemberListActions from './member-list.actions';
import * as MemberListSelectors from './member-list.selectors';
import { Member } from '../../types/member.model';

@Injectable()
export class MemberListFacade {
  readonly members$ = this.store.select(MemberListSelectors.members);
  readonly isLoading$ = this.store.select(MemberListSelectors.isLoading);

  constructor(private readonly store: Store) {}

  loadMembers(): void {
    this.store.dispatch(MemberListActions.loadMembersStarted());
  }

  onAddMember(): void {
    this.store.dispatch(MemberListActions.createMemberSelected());
  }

  onEditMember(member: Member): void {
    this.store.dispatch(MemberListActions.editMemberSelected({ memberToEdit: member }));
  }

  onDeleteMember(member: Member): void {
    this.store.dispatch(
      MemberListActions.deleteMemberSelected({ memberToDelete: member })
    );
  }
}
