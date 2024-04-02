import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ScheduleActions, ScheduleSelectors } from '@app/store/schedule';
import type { ClubEvent } from '@app/types';

@Injectable()
export class EventFormFacade {
  readonly selectedEvent$ = this.store.select(ScheduleSelectors.selectedEvent);
  readonly eventCurrently$ = this.store.select(ScheduleSelectors.eventCurrently);
  readonly isEditMode$ = this.store.select(ScheduleSelectors.isEditMode);
  readonly hasUnsavedChanges$ = this.store.select(ScheduleSelectors.hasUnsavedChanges);

  constructor(private readonly store: Store) {}

  onCancel(): void {
    this.store.dispatch(ScheduleActions.cancelSelected());
  }

  onSubmit(event: ClubEvent): void {
    this.isEditMode$
      .pipe(
        map(isEditMode => {
          if (isEditMode) {
            this.store.dispatch(
              ScheduleActions.updateEventSelected({
                eventToUpdate: event,
              }),
            );
          } else {
            this.store.dispatch(ScheduleActions.addEventSelected({ eventToAdd: event }));
          }
        }),
        first(),
      )
      .subscribe();
  }

  onValueChange(event: ClubEvent): void {
    this.store.dispatch(ScheduleActions.formDataChanged({ event }));
  }
}
