import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { EventsSelectors } from '@app/store/events';

@Injectable()
export class EventEditorFacade {
  readonly controlMode$ = this.store.select(EventsSelectors.controlMode);
  readonly hasUnsavedChanges$ = this.store.select(EventsSelectors.hasUnsavedChanges);
  readonly setEventTitle$ = this.store.select(EventsSelectors.setEventTitle);

  constructor(private readonly store: Store) {}
}
