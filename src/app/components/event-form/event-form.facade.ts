import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ScheduleActions, ScheduleSelectors } from '@app/store/schedule';
import type { ClubEvent } from '@app/types';

@Injectable()
export class EventFormFacade {
  readonly eventCurrently$ = this.store.select(ScheduleSelectors.eventCurrently);
  readonly hasUnsavedChanges$ = this.store.select(ScheduleSelectors.hasUnsavedChanges);
  readonly isEditMode$ = this.store.select(ScheduleSelectors.isEditMode);
  readonly selectedEvent$ = this.store.select(ScheduleSelectors.selectedEvent);

  constructor(private readonly store: Store) {}

  onCancel(): void {
    this.store.dispatch(ScheduleActions.cancelSelected());
  }

  onSubmit(event: ClubEvent): void {
    this.isEditMode$
      .pipe(
        map((isEditMode) =>
          isEditMode
            ? this.store.dispatch(
                ScheduleActions.updateEventSelected({
                  event,
                }),
              )
            : this.store.dispatch(ScheduleActions.addEventSelected({ event })),
        ),
        first(),
      )
      .subscribe();
  }

  onValueChange(event: ClubEvent): void {
    this.store.dispatch(ScheduleActions.formDataChanged({ event }));
  }
}
