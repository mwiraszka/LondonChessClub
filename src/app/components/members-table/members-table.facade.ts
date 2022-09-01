import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AuthSelectors } from '@app/store/auth';
import { MembersActions, MembersSelectors } from '@app/store/members';
import { Member } from '@app/types';

@Injectable()
export class MembersTableFacade {
  readonly members$ = this.store.select(MembersSelectors.members);
  readonly activeMembers$ = this.members$.pipe(
    map((members) => members.filter((member) => member.isActive))
  );

  readonly isLoading$ = this.store.select(MembersSelectors.isLoading);
  readonly isAdmin$ = this.store.select(AuthSelectors.isAdmin);
  readonly sortedBy$ = this.store.select(MembersSelectors.sortedBy);
  readonly isDescending$ = this.store.select(MembersSelectors.isDescending);

  constructor(private readonly store: Store) {}

  loadMembers(): void {
    this.store.dispatch(MembersActions.loadMembersStarted());
  }

  onSelectTableHeader(header: string): void {
    this.store.dispatch(MembersActions.tableHeaderSelected({ header }));
  }

  onAddMember(): void {
    this.store.dispatch(MembersActions.createMemberSelected());
  }

  onEditMember(memberToEdit: Member): void {
    this.store.dispatch(MembersActions.editMemberSelected({ memberToEdit }));
  }

  onDeleteMember(memberToDelete: Member): void {
    this.store.dispatch(MembersActions.deleteMemberSelected({ memberToDelete }));
  }
}
