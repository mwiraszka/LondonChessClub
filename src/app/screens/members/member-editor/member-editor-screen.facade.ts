import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { Member } from '@app/shared/types';

import * as MemberEditorScreenActions from './store/member-editor-screen.actions';
import * as MemberEditorScreenSelectors from './store/member-editor-screen.selectors';

@Injectable()
export class MemberEditorScreenFacade {
  readonly memberBeforeEdit$ = this.store.select(
    MemberEditorScreenSelectors.memberBeforeEdit
  );
  readonly memberCurrently$ = this.store.select(
    MemberEditorScreenSelectors.memberCurrently
  );
  readonly isEditMode$ = this.store.select(MemberEditorScreenSelectors.isEditMode);
  readonly hasUnsavedChanges$ = this.store.select(
    MemberEditorScreenSelectors.hasUnsavedChanges
  );

  constructor(private readonly store: Store) {}

  onCancel(): void {
    this.store.dispatch(MemberEditorScreenActions.cancelSelected());
  }

  onSubmit(member: Member): void {
    this.isEditMode$
      .pipe(
        map((isEditMode) => {
          if (isEditMode) {
            this.store.dispatch(
              MemberEditorScreenActions.updateMemberSelected({
                memberToUpdate: member,
              })
            );
          } else {
            this.store.dispatch(
              MemberEditorScreenActions.addMemberSelected({ memberToAdd: member })
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
          this.store.dispatch(
            MemberEditorScreenActions.formDataChanged({ member: updatedMember })
          );
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
      id: memberBeforeEdit.id,
      peakRating: newPeakRating,
    };
  }
}
