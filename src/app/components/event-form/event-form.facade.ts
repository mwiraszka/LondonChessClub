import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ScheduleActions, ScheduleSelectors } from '@app/store/schedule';
import { type ClubEvent, ControlModes } from '@app/types';

@Injectable()
export class EventFormFacade {
  readonly formEvent$ = this.store.select(ScheduleSelectors.formEvent);
  readonly controlMode$ = this.store.select(ScheduleSelectors.controlMode);
  readonly hasUnsavedChanges$ = this.store.select(ScheduleSelectors.hasUnsavedChanges);
  readonly selectedEvent$ = this.store.select(ScheduleSelectors.selectedEvent);

  constructor(private readonly store: Store) {}

  onCancel(): void {
    this.store.dispatch(ScheduleActions.cancelSelected());
  }

  onSubmit(event: ClubEvent): void {
    this.controlMode$
      .pipe(
        map(controlMode =>
          controlMode === ControlModes.EDIT
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
