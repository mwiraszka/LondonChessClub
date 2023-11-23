/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, tap } from 'rxjs/operators';

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
      switchMap(({ limitToUpcoming }) =>
        this.scheduleService.getEvents(limitToUpcoming).pipe(
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
        const modifiedEventToUpdate = {
          ...eventToUpdate,
          dateEdited: new Date().toLocaleDateString(),
        };

        return this.scheduleService.updateEvent(modifiedEventToUpdate).pipe(
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

  resetEventEditorForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter(
        (action: RouterNavigatedAction) =>
          action.payload.event.urlAfterRedirects === '/event/add',
      ),
      map(() => ScheduleActions.resetEventForm()),
    ),
  );

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ScheduleActions.loadEventsFailed,
          ScheduleActions.addEventFailed,
          ScheduleActions.updateEventFailed,
          ScheduleActions.deleteEventFailed,
        ),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private scheduleService: ScheduleService,
    private store: Store,
  ) {}
}
