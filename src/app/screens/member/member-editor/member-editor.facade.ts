import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { MembersSelectors } from '@app/store/members';

@Injectable()
export class MemberEditorFacade {
  readonly controlMode$ = this.store.select(MembersSelectors.controlMode);
  readonly hasUnsavedChanges$ = this.store.select(MembersSelectors.hasUnsavedChanges);
  readonly setMemberName$ = this.store.select(MembersSelectors.setMemberName);

  constructor(private readonly store: Store) {}
}
