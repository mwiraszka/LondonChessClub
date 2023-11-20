import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ScheduleSelectors } from '@app/store/schedule';

@Injectable()
export class EventEditorScreenFacade {
  readonly isEditMode$ = this.store.select(ScheduleSelectors.isEditMode);

  readonly titleBeforeEdit$ = this.store
    .select(ScheduleSelectors.eventBeforeEdit)
    .pipe(map(event => event.title));

  constructor(private readonly store: Store) {}
}
