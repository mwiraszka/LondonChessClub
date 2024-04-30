import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ScheduleSelectors } from '@app/store/schedule';

@Injectable()
export class EventEditorFacade {
  readonly isEditMode$ = this.store.select(ScheduleSelectors.isEditMode);
  readonly selectedEventTitle$ = this.store.select(ScheduleSelectors.selectedEventTitle);

  constructor(private readonly store: Store) {}
}
