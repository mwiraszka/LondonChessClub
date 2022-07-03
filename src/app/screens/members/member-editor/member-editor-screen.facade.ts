import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';

import * as MemberEditorScreenActions from './store/member-editor-screen.actions';
import * as MemberEditorScreenSelectors from './store/member-editor-screen.selectors';
import { Member } from '../types/member.model';

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

  onCancel(): void {
    this.store.dispatch(MemberEditorScreenActions.cancelSelected());
  }

  onSubmit(member: Member): void {
    combineLatest([this.isEditMode$, this.memberBeforeEdit$])
      .pipe(
        map(([isEditMode, memberBeforeEdit]) => {
          const newRating = member.rating;
          const oldPeakRating = memberBeforeEdit.peakRating;
          const newPeakRating = newRating > oldPeakRating ? newRating : oldPeakRating;

          const memberToSubmit: Member = {
            ...member,
            id: memberBeforeEdit.id,
            dateOfBirth: member.dateOfBirth ?? '',
            peakRating: newPeakRating,
          };

          if (isEditMode) {
            this.store.dispatch(
              MemberEditorScreenActions.updateMemberSelected({
                memberToUpdate: memberToSubmit,
              })
            );
          } else {
            this.store.dispatch(
              MemberEditorScreenActions.addMemberSelected({ memberToAdd: memberToSubmit })
            );
          }
        }),
        first()
      )
      .subscribe();
  }

  onValueChange(formData: Member): void {
    this.store.dispatch(MemberEditorScreenActions.formDataChanged({ formData }));
  }

  constructor(private readonly store: Store) {}
}
