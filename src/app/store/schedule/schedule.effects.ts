import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { LoaderService, ScheduleService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import type { ClubEvent, ModificationInfo, ServiceResponse } from '@app/types';

import * as ScheduleActions from './schedule.actions';
import * as ScheduleSelectors from './schedule.selectors';

@Injectable()
export class ScheduleEffects {
  fetchEvents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.fetchEventsRequested),
      tap(() => this.loaderService.display(true)),
      switchMap(() =>
        this.scheduleService.getEvents().pipe(
          map((response: ServiceResponse<ClubEvent[]>) =>
            response.error
              ? ScheduleActions.fetchEventsFailed({ error: response.error })
              : ScheduleActions.fetchEventsSucceeded({
                  allEvents: response.payload!,
                }),
          ),
        ),
      ),
      tap(() => this.loaderService.display(false)),
    );
  });

  fetchEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.fetchEventRequested),
      tap(() => this.loaderService.display(true)),
      switchMap(({ eventId }) =>
        this.scheduleService.getEvent(eventId).pipe(
          map((response: ServiceResponse<ClubEvent>) =>
            response.error
              ? ScheduleActions.fetchEventFailed({
                  error: response.error,
                })
              : ScheduleActions.fetchEventSucceeded({
                  event: response.payload!,
                }),
          ),
        ),
      ),
      tap(() => this.loaderService.display(false)),
    );
  });

  addEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.addEventConfirmed),
      tap(() => this.loaderService.display(true)),
      concatLatestFrom(() => [
        this.store.select(ScheduleSelectors.eventCurrently),
        this.store.select(AuthSelectors.user),
      ]),
      switchMap(([, eventToAdd, user]) => {
        const dateNow = new Date(Date.now());
        const modificationInfo: ModificationInfo = {
          createdBy: `${user!.firstName} ${user!.lastName}`,
          dateCreated: dateNow,
          lastEditedBy: `${user!.firstName} ${user!.lastName}`,
          dateLastEdited: dateNow,
        };
        const modifiedEvent = { ...eventToAdd!, modificationInfo };

        return this.scheduleService.addEvent(modifiedEvent).pipe(
          map((response: ServiceResponse<ClubEvent>) =>
            response.error
              ? ScheduleActions.addEventFailed({ error: response.error })
              : ScheduleActions.addEventSucceeded({
                  event: response.payload!,
                }),
          ),
        );
      }),
      tap(() => this.loaderService.display(false)),
    );
  });

  updateEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.updateEventConfirmed),
      tap(() => this.loaderService.display(true)),
      concatLatestFrom(() => [
        this.store.select(ScheduleSelectors.eventCurrently),
        this.store.select(AuthSelectors.user),
      ]),
      switchMap(([, eventToUpdate, user]) => {
        const dateNow = new Date(Date.now());
        const modificationInfo: ModificationInfo = {
          createdBy: eventToUpdate!.modificationInfo!.createdBy,
          dateCreated: eventToUpdate!.modificationInfo!.dateCreated,
          lastEditedBy: `${user!.firstName} ${user!.lastName}`,
          dateLastEdited: dateNow,
        };
        const modifiedEvent = { ...eventToUpdate!, modificationInfo };

        return this.scheduleService.updateEvent(modifiedEvent).pipe(
          map((response: ServiceResponse<ClubEvent>) =>
            response.error
              ? ScheduleActions.updateEventFailed({ error: response.error })
              : ScheduleActions.updateEventSucceeded({
                  event: response.payload!,
                }),
          ),
        );
      }),
      tap(() => this.loaderService.display(false)),
    );
  });

  deleteEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.deleteEventConfirmed),
      tap(() => this.loaderService.display(true)),
      concatLatestFrom(() => this.store.select(ScheduleSelectors.selectedEvent)),
      switchMap(([, eventToDelete]) =>
        this.scheduleService.deleteEvent(eventToDelete!).pipe(
          map((response: ServiceResponse<ClubEvent>) =>
            response.error
              ? ScheduleActions.deleteEventFailed({ error: response.error })
              : ScheduleActions.deleteEventSucceeded({
                  event: response.payload!,
                }),
          ),
        ),
      ),
      tap(() => this.loaderService.display(false)),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private loaderService: LoaderService,
    private scheduleService: ScheduleService,
  ) {}
}
