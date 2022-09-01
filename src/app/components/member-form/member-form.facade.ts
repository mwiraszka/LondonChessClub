import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { MembersActions, MembersSelectors } from '@app/store/members';
import { Member } from '@app/types';

@Injectable()
export class MemberFormFacade {
  readonly memberBeforeEdit$ = this.store.select(MembersSelectors.memberBeforeEdit);
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
        map((isEditMode) => {
          if (isEditMode) {
            this.store.dispatch(
              MembersActions.updateMemberSelected({
                memberToUpdate: member,
              })
            );
          } else {
            this.store.dispatch(
              MembersActions.addMemberSelected({ memberToAdd: member })
            );
          }
        }),
        first()
      )
      .subscribe();
  }

  onValueChange(member: Member): void {
    this.memberBeforeEdit$
      .pipe(
        map((memberBeforeEdit) => {
          const updatedMember = this.updatePeakRating(member, memberBeforeEdit);
          this.store.dispatch(MembersActions.formDataChanged({ member: updatedMember }));
        }),
        first()
      )
      .subscribe();
  }

  private updatePeakRating(member: Member, memberBeforeEdit: Member): Member {
    let newPeakRating = '';
    if (member.rating.includes('/')) {
      newPeakRating = '(provisional)';
    } else if (
      memberBeforeEdit.peakRating === '(provisional)' ||
      +member.rating > +memberBeforeEdit.rating
    ) {
      newPeakRating = member.rating;
    } else {
      newPeakRating = memberBeforeEdit.peakRating;
    }

    return {
      ...member,
      peakRating: newPeakRating,
    };
  }
}
