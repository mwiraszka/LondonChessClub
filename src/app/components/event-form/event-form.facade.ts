import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { ScheduleActions, ScheduleSelectors } from '@app/store/schedule';
import { ClubEvent } from '@app/types';

@Injectable()
export class EventFormFacade {
  readonly eventBeforeEdit$ = this.store.select(ScheduleSelectors.eventBeforeEdit);
  readonly eventCurrently$ = this.store.select(ScheduleSelectors.eventCurrently);
  readonly isEditMode$ = this.store.select(ScheduleSelectors.isEditMode);
  readonly hasUnsavedChanges$ = this.store.select(ScheduleSelectors.hasUnsavedChanges);

  constructor(private readonly store: Store) {}

  onCancel(): void {
    this.store.dispatch(ScheduleActions.cancelSelected());
  }

  onSubmit(event: ClubEvent): void {
    event = { ...event, dateEdited: new Date().toLocaleDateString() };
    this.isEditMode$
      .pipe(
        map((isEditMode) => {
          if (isEditMode) {
            this.store.dispatch(
              ScheduleActions.updateEventSelected({
                eventToUpdate: event,
              })
            );
          } else {
            this.store.dispatch(ScheduleActions.addEventSelected({ eventToAdd: event }));
          }
        }),
        first()
      )
      .subscribe();
  }

  onValueChange(event: ClubEvent): void {
    event = { ...event, dateEdited: new Date().toLocaleDateString() };
    this.store.dispatch(ScheduleActions.formDataChanged({ event }));
  }
}
