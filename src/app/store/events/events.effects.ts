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
import type { Event, ModificationInfo } from '@app/types';
import { isDefined, parseHttpErrorResponse } from '@app/utils';

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
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            return of(EventsActions.fetchEventsFailed({ errorResponse }));
          }),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  fetchEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.fetchEventRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(({ eventId }) => {
        return this.eventsService.getEvent(eventId).pipe(
          map(event => EventsActions.fetchEventSucceeded({ event })),
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            return of(EventsActions.fetchEventFailed({ errorResponse }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  addEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.addEventRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(EventsSelectors.selectEventFormData).pipe(filter(isDefined)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, eventFormData, user]) => {
        const modificationInfo: ModificationInfo = {
          createdBy: `${user.firstName} ${user.lastName}`,
          dateCreated: moment().toISOString(),
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: moment().toISOString(),
        };
        const modifiedEvent: Event = { ...eventFormData, modificationInfo, id: null };

        return this.eventsService.addEvent(modifiedEvent).pipe(
          map(event => EventsActions.addEventSucceeded({ event })),
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            return of(EventsActions.addEventFailed({ errorResponse }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  updateEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.updateEventRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(EventsSelectors.selectEvent).pipe(filter(isDefined)),
        this.store.select(EventsSelectors.selectEventFormData).pipe(filter(isDefined)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, event, eventFormData, user]) => {
        const modificationInfo: ModificationInfo = {
          ...event.modificationInfo!,
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: moment().toISOString(),
        };
        const modifiedEvent = { ...event, ...eventFormData, modificationInfo };

        return this.eventsService.updateEvent(modifiedEvent).pipe(
          map(event => EventsActions.updateEventSucceeded({ event })),
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            return of(EventsActions.updateEventFailed({ errorResponse }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  deleteEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.deleteEventRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(({ event }) =>
        this.eventsService.deleteEvent(event).pipe(
          map(event => EventsActions.deleteEventSucceeded({ event })),
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            return of(EventsActions.deleteEventFailed({ errorResponse }));
          }),
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
