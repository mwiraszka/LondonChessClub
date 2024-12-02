import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ScheduleActions, ScheduleSelectors } from '@app/store/schedule';
import type { ClubEvent } from '@app/types';

@Injectable()
export class EventFormFacade {
  readonly controlMode$ = this.store.select(ScheduleSelectors.controlMode);
  readonly formEvent$ = this.store.select(ScheduleSelectors.formEvent);
  readonly hasUnsavedChanges$ = this.store.select(ScheduleSelectors.hasUnsavedChanges);
  readonly setEvent$ = this.store.select(ScheduleSelectors.setEvent);

  constructor(private readonly store: Store) {}

  onCancel(): void {
    this.store.dispatch(ScheduleActions.cancelSelected());
  }

  onSubmit(event: ClubEvent): void {
    this.controlMode$
      .pipe(
        map(controlMode =>
          controlMode === 'edit'
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
    console.log(':: value change in event form!', event);
    this.store.dispatch(ScheduleActions.formDataChanged({ event }));
  }
}
