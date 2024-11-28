import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LoaderService, ScheduleService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import type { ModificationInfo } from '@app/types';

import * as ScheduleActions from './schedule.actions';
import * as ScheduleSelectors from './schedule.selectors';

@Injectable()
export class ScheduleEffects {
  fetchEvents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.fetchEventsRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(() =>
        this.scheduleService.getEvents().pipe(
          map(allEvents => ScheduleActions.fetchEventsSucceeded({ allEvents })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(ScheduleActions.fetchEventsFailed({ errorResponse })),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  fetchEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.eventEditRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(({ eventId }) =>
        this.scheduleService.getEvent(eventId).pipe(
          map(event => ScheduleActions.fetchEventSucceeded({ event })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(ScheduleActions.fetchEventFailed({ errorResponse })),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  addEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.addEventConfirmed),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(ScheduleSelectors.formEvent),
        this.store.select(AuthSelectors.user),
      ]),
      switchMap(([, eventToAdd, user]) => {
        if (!eventToAdd || !user) {
          this.loaderService.setIsLoading(false);
          return EMPTY;
        }

        const dateNow = new Date();
        const modificationInfo: ModificationInfo = {
          createdBy: `${user.firstName} ${user.lastName}`,
          dateCreated: dateNow,
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: dateNow,
        };
        const modifiedEvent = { ...eventToAdd, modificationInfo };

        return this.scheduleService.addEvent(modifiedEvent).pipe(
          map(event => ScheduleActions.addEventSucceeded({ event })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(ScheduleActions.addEventFailed({ errorResponse })),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  updateEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.updateEventConfirmed),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(ScheduleSelectors.formEvent),
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
          map(event => ScheduleActions.updateEventSucceeded({ event })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(ScheduleActions.updateEventFailed({ errorResponse })),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  deleteEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.deleteEventConfirmed),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => this.store.select(ScheduleSelectors.setEvent)),
      switchMap(([, eventToDelete]) =>
        this.scheduleService.deleteEvent(eventToDelete!).pipe(
          map(event => ScheduleActions.deleteEventSucceeded({ event })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(ScheduleActions.deleteEventFailed({ errorResponse })),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private loaderService: LoaderService,
    private scheduleService: ScheduleService,
  ) {}
}
