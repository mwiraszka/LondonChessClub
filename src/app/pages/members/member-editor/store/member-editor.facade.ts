import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';

import { areSame } from '@app/shared/utils';

import * as MemberEditorActions from './member-editor.actions';
import * as MemberEditorSelectors from './member-editor.selectors';
import { Member } from '../../types/member.model';

@Injectable()
export class MemberEditorFacade {
  readonly memberBeforeEdit$ = this.store.select(MemberEditorSelectors.memberBeforeEdit);
  readonly isEditMode$ = this.store.select(MemberEditorSelectors.isEditMode);
  readonly hasUnsavedChanges$ = this.store.select(
    MemberEditorSelectors.hasUnsavedChanges
  );

  onCancel(): void {
    this.store.dispatch(MemberEditorActions.cancelSelected());
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
            _id: memberBeforeEdit._id,
            peakRating: newPeakRating,
          };

          if (isEditMode) {
            this.store.dispatch(
              MemberEditorActions.updateMemberSelected({ memberToUpdate: memberToSubmit })
            );
          } else {
            this.store.dispatch(
              MemberEditorActions.addMemberSelected({ memberToAdd: memberToSubmit })
            );
          }
        }),
        first()
      )
      .subscribe();
  }

  onValueChange(member: Member): void {
    combineLatest([this.memberBeforeEdit$, this.hasUnsavedChanges$])
      .pipe(
        tap(([memberBeforeEdit, hadUnsavedChanges]) => {
          const unsavedChangesDetected = !areSame(member, memberBeforeEdit);

          if (!hadUnsavedChanges && unsavedChangesDetected) {
            this.store.dispatch(MemberEditorActions.unsavedChangesDetected());
          } else if (hadUnsavedChanges && !unsavedChangesDetected) {
            this.store.dispatch(MemberEditorActions.noUnsavedChangesDetected());
          }
        }),
        first()
      )
      .subscribe();
  }

  constructor(private readonly store: Store) {}
}
