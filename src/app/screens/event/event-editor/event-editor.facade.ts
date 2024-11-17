import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ScheduleSelectors } from '@app/store/schedule';

@Injectable()
export class EventEditorFacade {
  readonly controlMode$ = this.store.select(ScheduleSelectors.controlMode);
  readonly hasUnsavedChanges$ = this.store.select(ScheduleSelectors.hasUnsavedChanges);
  readonly setEventTitle$ = this.store.select(ScheduleSelectors.setEventTitle);

  constructor(private readonly store: Store) {}
}
