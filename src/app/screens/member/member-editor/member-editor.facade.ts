import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { MembersSelectors } from '@app/store/members';

@Injectable()
export class MemberEditorFacade {
  controlMode$ = this.store.select(MembersSelectors.controlMode);
  selectedMemberName$ = this.store.select(MembersSelectors.selectedMemberName);

  constructor(private readonly store: Store) {}
}
