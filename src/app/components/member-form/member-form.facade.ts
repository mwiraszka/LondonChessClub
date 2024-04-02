import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { MembersActions, MembersSelectors } from '@app/store/members';
import type { Member } from '@app/types';

@Injectable()
export class MemberFormFacade {
  readonly selectedMember$ = this.store.select(MembersSelectors.selectedMember);
  readonly memberCurrently$ = this.store.select(MembersSelectors.memberCurrently);
  readonly isEditMode$ = this.store.select(MembersSelectors.isEditMode);
  readonly hasUnsavedChanges$ = this.store.select(MembersSelectors.hasUnsavedChanges);

  constructor(private readonly store: Store) {}

  onCancel(): void {
    this.store.dispatch(MembersActions.cancelSelected());
  }

  onSubmit(member: Member): void {
    this.isEditMode$
      .pipe(
        map(isEditMode => {
          if (isEditMode) {
            this.store.dispatch(
              MembersActions.updateMemberSelected({
                memberToUpdate: member,
              }),
            );
          } else {
            this.store.dispatch(
              MembersActions.addMemberSelected({ memberToAdd: member }),
            );
          }
        }),
        first(),
      )
      .subscribe();
  }

  onValueChange(member: Member): void {
    this.store.dispatch(MembersActions.formDataChanged({ member }));
  }
}
