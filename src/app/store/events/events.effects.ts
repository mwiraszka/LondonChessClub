import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EventsService, LoaderService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import type { ModificationInfo } from '@app/types';
import { isDefined } from '@app/utils';

import * as EventsActions from './events.actions';
import * as EventsSelectors from './events.selectors';

@Injectable()
export class EventsEffects {
  fetchEvents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.fetchEventsRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(() =>
        this.eventsService.getEvents().pipe(
          map(events => EventsActions.fetchEventsSucceeded({ events })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(EventsActions.fetchEventsFailed({ errorResponse })),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  fetchEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.eventEditRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(({ eventId }) =>
        this.eventsService.getEvent(eventId).pipe(
          map(event => EventsActions.fetchEventSucceeded({ event })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(EventsActions.fetchEventFailed({ errorResponse })),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  addEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.addEventConfirmed),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(EventsSelectors.formEvent).pipe(filter(isDefined)),
        this.store.select(AuthSelectors.user).pipe(filter(isDefined)),
      ]),
      switchMap(([, eventToAdd, user]) => {
        const dateNow = moment().toISOString();
        const modificationInfo: ModificationInfo = {
          createdBy: `${user.firstName} ${user.lastName}`,
          dateCreated: dateNow,
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: dateNow,
        };
        const modifiedEvent = { ...eventToAdd, modificationInfo };

        return this.eventsService.addEvent(modifiedEvent).pipe(
          map(event => EventsActions.addEventSucceeded({ event })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(EventsActions.addEventFailed({ errorResponse })),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  updateEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.updateEventConfirmed),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(EventsSelectors.formEvent).pipe(filter(isDefined)),
        this.store.select(AuthSelectors.user).pipe(filter(isDefined)),
      ]),
      switchMap(([, eventToUpdate, user]) => {
        const modificationInfo: ModificationInfo = {
          createdBy: eventToUpdate.modificationInfo!.createdBy,
          dateCreated: eventToUpdate.modificationInfo!.dateCreated,
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: moment().toISOString(),
        };
        const modifiedEvent = { ...eventToUpdate, modificationInfo };

        return this.eventsService.updateEvent(modifiedEvent).pipe(
          map(event => EventsActions.updateEventSucceeded({ event })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(EventsActions.updateEventFailed({ errorResponse })),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  deleteEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.deleteEventConfirmed),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() =>
        this.store.select(EventsSelectors.setEvent).pipe(filter(isDefined)),
      ),
      switchMap(([, eventToDelete]) =>
        this.eventsService.deleteEvent(eventToDelete).pipe(
          map(event => EventsActions.deleteEventSucceeded({ event })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(EventsActions.deleteEventFailed({ errorResponse })),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private eventsService: EventsService,
    private loaderService: LoaderService,
  ) {}
}
