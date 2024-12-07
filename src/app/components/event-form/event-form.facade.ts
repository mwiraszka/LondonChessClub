import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { EventsActions, EventsSelectors } from '@app/store/events';
import type { Event } from '@app/types';

@Injectable()
export class EventFormFacade {
  readonly controlMode$ = this.store.select(EventsSelectors.controlMode);
  readonly formEvent$ = this.store.select(EventsSelectors.formEvent);
  readonly hasUnsavedChanges$ = this.store.select(EventsSelectors.hasUnsavedChanges);
  readonly setEvent$ = this.store.select(EventsSelectors.setEvent);

  constructor(private readonly store: Store) {}

  onCancel(): void {
    this.store.dispatch(EventsActions.cancelSelected());
  }

  onSubmit(event: Event): void {
    this.controlMode$
      .pipe(
        map(controlMode =>
          controlMode === 'edit'
            ? this.store.dispatch(
                EventsActions.updateEventSelected({
                  event,
                }),
              )
            : this.store.dispatch(EventsActions.addEventSelected({ event })),
        ),
        first(),
      )
      .subscribe();
  }

  onValueChange(event: Event): void {
    this.store.dispatch(EventsActions.formDataChanged({ event }));
  }
}
