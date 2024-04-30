import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { MembersSelectors } from '@app/store/members';

@Injectable()
export class MemberEditorFacade {
  isEditMode$ = this.store.select(MembersSelectors.isEditMode);
  selectedMemberName$ = this.store.select(MembersSelectors.selectedMemberName);

  constructor(private readonly store: Store) {}
}
