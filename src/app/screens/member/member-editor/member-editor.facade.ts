import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { MembersSelectors } from '@app/store/members';

@Injectable()
export class MemberEditorFacade {
  controlMode$ = this.store.select(MembersSelectors.controlMode);
  readonly hasUnsavedChanges$ = this.store.select(MembersSelectors.hasUnsavedChanges);
  selectedMemberName$ = this.store.select(MembersSelectors.selectedMemberName);

  constructor(private readonly store: Store) {}
}
