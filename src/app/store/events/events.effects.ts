import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Event } from '@app/models';
import { EventsService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { isDefined, parseError } from '@app/utils';

import { EventsActions, EventsSelectors } from '.';

@Injectable()
export class EventsEffects {
  fetchEvents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.fetchEventsRequested),
      switchMap(() =>
        this.eventsService.getEvents().pipe(
          map(response => EventsActions.fetchEventsSucceeded({ events: response.data })),
          catchError(error =>
            of(EventsActions.fetchEventsFailed({ error: parseError(error) })),
          ),
        ),
      ),
    );
  });

  fetchEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.fetchEventRequested),
      switchMap(({ eventId }) => {
        return this.eventsService.getEvent(eventId).pipe(
          map(response => EventsActions.fetchEventSucceeded({ event: response.data })),
          catchError(error =>
            of(EventsActions.fetchEventFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  addEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.addEventRequested),
      concatLatestFrom(() => [
        this.store.select(EventsSelectors.selectEventFormDataById(null)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, formData, user]) => {
        const event: Event = {
          ...formData,
          id: '',
          modificationInfo: {
            createdBy: `${user.firstName} ${user.lastName}`,
            dateCreated: moment().toISOString(),
            lastEditedBy: `${user.firstName} ${user.lastName}`,
            dateLastEdited: moment().toISOString(),
          },
        };

        return this.eventsService.addEvent(event).pipe(
          map(response =>
            EventsActions.addEventSucceeded({
              event: { ...event, id: response.data },
            }),
          ),
          catchError(error =>
            of(EventsActions.addEventFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  updateEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.updateEventRequested),
      concatLatestFrom(({ eventId }) => [
        this.store
          .select(EventsSelectors.selectEventById(eventId))
          .pipe(filter(isDefined)),
        this.store.select(EventsSelectors.selectEventFormDataById(eventId)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, event, formData, user]) => {
        const updatedEvent = {
          ...event,
          ...formData,
          modificationInfo: {
            ...event.modificationInfo,
            lastEditedBy: `${user.firstName} ${user.lastName}`,
            dateLastEdited: moment().toISOString(),
          },
        };

        return this.eventsService.updateEvent(updatedEvent).pipe(
          filter(response => response.data === updatedEvent.id),
          map(() =>
            EventsActions.updateEventSucceeded({
              event: updatedEvent,
              originalEventTitle: event.title,
            }),
          ),
          catchError(error =>
            of(EventsActions.updateEventFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  deleteEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.deleteEventRequested),
      switchMap(({ event }) =>
        this.eventsService.deleteEvent(event.id).pipe(
          filter(response => response.data === event.id),
          map(() =>
            EventsActions.deleteEventSucceeded({
              eventId: event.id,
              eventTitle: event.title,
            }),
          ),
          catchError(error =>
            of(EventsActions.deleteEventFailed({ error: parseError(error) })),
          ),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly eventsService: EventsService,
    private readonly store: Store,
  ) {}
}
