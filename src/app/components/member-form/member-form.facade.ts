import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { MembersActions, MembersSelectors } from '@app/store/members';
import type { Member } from '@app/types';

@Injectable()
export class MemberFormFacade {
  readonly hasUnsavedChanges$ = this.store.select(MembersSelectors.hasUnsavedChanges);
  readonly controlMode$ = this.store.select(MembersSelectors.controlMode);
  readonly formMember$ = this.store.select(MembersSelectors.formMember);
  readonly selectedMember$ = this.store.select(MembersSelectors.selectedMember);

  constructor(private readonly store: Store) {}

  onCancel(): void {
    this.store.dispatch(MembersActions.cancelSelected());
  }

  onSubmit(member: Member): void {
    this.controlMode$
      .pipe(
        map(controlMode =>
          controlMode
            ? this.store.dispatch(
                MembersActions.updateMemberSelected({
                  member,
                }),
              )
            : this.store.dispatch(MembersActions.addMemberSelected({ member })),
        ),
        first(),
      )
      .subscribe();
  }

  onValueChange(member: Member): void {
    this.store.dispatch(MembersActions.formDataChanged({ member }));
  }
}
