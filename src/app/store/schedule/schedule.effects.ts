/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ScheduleService } from '@app/services';
import { ClubEvent, ServiceResponse } from '@app/types';

import * as ScheduleActions from './schedule.actions';
import * as ScheduleSelectors from './schedule.selectors';

@Injectable()
export class ScheduleEffects {
  getEvents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.loadEventsStarted),
      switchMap(() =>
        this.scheduleService.getEvents().pipe(
          map((response: ServiceResponse<ClubEvent[]>) =>
            response.error
              ? ScheduleActions.loadEventsFailed({ error: response.error })
              : ScheduleActions.loadEventsSucceeded({
                  allEvents: response.payload!,
                }),
          ),
        ),
      ),
    );
  });

  deleteEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.deleteEventConfirmed),
      concatLatestFrom(() => this.store.select(ScheduleSelectors.selectedEvent)),
      switchMap(([, eventToDelete]) =>
        this.scheduleService.deleteEvent(eventToDelete!).pipe(
          map((response: ServiceResponse<ClubEvent>) =>
            response.error
              ? ScheduleActions.deleteEventFailed({ error: response.error })
              : ScheduleActions.deleteEventSucceeded({
                  deletedEvent: response.payload!,
                }),
          ),
        ),
      ),
    );
  });

  resetEventForm$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.createEventSelected),
      map(() => ScheduleActions.resetEventForm()),
    );
  });

  addEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.addEventConfirmed),
      concatLatestFrom(() => this.store.select(ScheduleSelectors.eventCurrently)),
      switchMap(([, eventToAdd]) => {
        return this.scheduleService.addEvent(eventToAdd).pipe(
          map((response: ServiceResponse<ClubEvent>) =>
            response.error
              ? ScheduleActions.addEventFailed({ error: response.error })
              : ScheduleActions.addEventSucceeded({
                  addedEvent: response.payload!,
                }),
          ),
        );
      }),
    );
  });

  updateEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.updateEventConfirmed),
      concatLatestFrom(() => this.store.select(ScheduleSelectors.eventCurrently)),
      switchMap(([, eventToUpdate]) => {
        return this.scheduleService.updateEvent(eventToUpdate).pipe(
          map((response: ServiceResponse<ClubEvent>) =>
            response.error
              ? ScheduleActions.updateEventFailed({ error: response.error })
              : ScheduleActions.updateEventSucceeded({
                  updatedEvent: response.payload!,
                }),
          ),
        );
      }),
    );
  });

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ScheduleActions.loadEventsFailed,
          ScheduleActions.addEventFailed,
          ScheduleActions.updateEventFailed,
          ScheduleActions.deleteEventFailed,
        ),
        tap(({ error }) => {
          console.error(`[Schedule] ${error.message}`);
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private scheduleService: ScheduleService,
    private store: Store,
  ) {}
}
