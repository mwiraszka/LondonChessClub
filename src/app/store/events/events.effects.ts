import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import type { Event, ModificationInfo } from '@app/models';
import { EventsService, LoaderService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { isDefined } from '@app/utils';
import { parseError } from '@app/utils/error/parse-error.util';

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
          map(response => EventsActions.fetchEventsSucceeded({ events: response.data })),
          catchError(error =>
            of(EventsActions.fetchEventsFailed({ error: parseError(error) })),
          ),
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
          map(response => EventsActions.fetchEventSucceeded({ event: response.data })),
          catchError(error =>
            of(EventsActions.fetchEventFailed({ error: parseError(error) })),
          ),
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
          map(response =>
            EventsActions.addEventSucceeded({
              event: { ...modifiedEvent, id: response.data },
            }),
          ),
          catchError(error =>
            of(EventsActions.addEventFailed({ error: parseError(error) })),
          ),
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
        const originalEventTitle = event.title;
        const modificationInfo: ModificationInfo = {
          ...event.modificationInfo,
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: moment().toISOString(),
        };
        const modifiedEvent = { ...event, ...eventFormData, modificationInfo };

        return this.eventsService.updateEvent(modifiedEvent).pipe(
          map(() =>
            EventsActions.updateEventSucceeded({
              event: modifiedEvent,
              originalEventTitle,
            }),
          ),
          catchError(error =>
            of(EventsActions.updateEventFailed({ error: parseError(error) })),
          ),
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
          map(() => EventsActions.deleteEventSucceeded({ event })),
          catchError(error =>
            of(EventsActions.deleteEventFailed({ error: parseError(error) })),
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
