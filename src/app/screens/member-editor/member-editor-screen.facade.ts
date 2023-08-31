import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { MembersSelectors } from '@app/store/members';

@Injectable()
export class MemberEditorScreenFacade {
  isEditMode$ = this.store.select(MembersSelectors.isEditMode);
  fullName$ = this.store.select(MembersSelectors.selectedMember).pipe(
    filter(member => !!member),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map(member => `${member!.firstName} ${member!.lastName}`),
  );

  constructor(private store: Store) {}
}
