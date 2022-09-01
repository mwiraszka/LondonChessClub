import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { MembersSelectors } from '@app/store/members';

@Injectable()
export class MemberEditorScreenFacade {
  isEditMode$ = this.store.select(MembersSelectors.isEditMode);
  fullName$ = this.store
    .select(MembersSelectors.memberBeforeEdit)
    .pipe(map((member) => `${member.firstName} ${member.lastName}`));

  constructor(private store: Store) {}
}
