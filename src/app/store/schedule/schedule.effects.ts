import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { ScheduleService } from '@app/services';
import { ServiceResponse } from '@app/types';

import * as ScheduleActions from './schedule.actions';
import * as ScheduleSelectors from './schedule.selectors';

@Injectable()
export class ScheduleEffects {
  getEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.loadEventsStarted),
      switchMap(() =>
        this.scheduleService.getEvents().pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ScheduleActions.loadEventsFailed({ error: response.error })
              : ScheduleActions.loadEventsSucceeded({
                  allEvents: response.payload.events,
                })
          )
        )
      )
    )
  );

  deleteEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.deleteEventConfirmed),
      concatLatestFrom(() => this.store.select(ScheduleSelectors.selectedEvent)),
      switchMap(([, eventToDelete]) =>
        this.scheduleService.deleteEvent(eventToDelete).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ScheduleActions.deleteEventFailed({ error: response.error })
              : ScheduleActions.deleteEventSucceeded({
                  deletedEvent: response.payload.event,
                })
          )
        )
      )
    )
  );

  resetEventForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.createEventSelected),
      map(() => ScheduleActions.resetEventForm())
    )
  );

  addEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.addEventConfirmed),
      concatLatestFrom(() => this.store.select(ScheduleSelectors.eventCurrently)),
      switchMap(([, eventToAdd]) => {
        return this.scheduleService.addEvent(eventToAdd).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ScheduleActions.addEventFailed({ error: response.error })
              : ScheduleActions.addEventSucceeded({
                  addedEvent: response.payload.event,
                })
          )
        );
      })
    )
  );

  updateEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.updateEventConfirmed),
      concatLatestFrom(() => this.store.select(ScheduleSelectors.eventCurrently)),
      switchMap(([, eventToUpdate]) => {
        return this.scheduleService.updateEvent(eventToUpdate).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ScheduleActions.updateEventFailed({ error: response.error })
              : ScheduleActions.updateEventSucceeded({
                  updatedEvent: response.payload.event,
                })
          )
        );
      })
    )
  );

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ScheduleActions.loadEventsFailed,
          ScheduleActions.addEventFailed,
          ScheduleActions.updateEventFailed,
          ScheduleActions.deleteEventFailed
        ),
        tap(({ error }) => {
          console.error(`[Schedule Effects] ${error.message}`);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private scheduleService: ScheduleService,
    private store: Store
  ) {}
}
