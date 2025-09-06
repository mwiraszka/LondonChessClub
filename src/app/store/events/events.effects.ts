import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { merge, of, timer } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { DataPaginationOptions, Event } from '@app/models';
import { EventsApiService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { isDefined, isExpired, parseError } from '@app/utils';

import { EventsActions, EventsSelectors } from '.';

@Injectable()
export class EventsEffects {
  fetchHomePageEvents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.fetchHomePageEventsRequested),
      switchMap(() => {
        const options: DataPaginationOptions<Event> = {
          page: 1,
          pageSize: 3,
          sortBy: 'eventDate',
          sortOrder: 'asc',
          filters: {
            showPastEvents: {
              label: 'Show past events',
              value: false,
            },
          },
          search: '',
        };

        return this.eventsApiService.getFilteredEvents(options).pipe(
          map(response =>
            EventsActions.fetchHomePageEventsSucceeded({
              events: response.data.items,
              totalCount: response.data.totalCount,
            }),
          ),
          catchError(error =>
            of(EventsActions.fetchHomePageEventsFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  fetchFilteredEvents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.fetchFilteredEventsRequested),
      concatLatestFrom(() => this.store.select(EventsSelectors.selectOptions)),
      switchMap(([, options]) =>
        this.eventsApiService.getFilteredEvents(options).pipe(
          map(response =>
            EventsActions.fetchFilteredEventsSucceeded({
              events: response.data.items,
              filteredCount: response.data.filteredCount,
              totalCount: response.data.totalCount,
            }),
          ),
          catchError(error =>
            of(EventsActions.fetchFilteredEventsFailed({ error: parseError(error) })),
          ),
        ),
      ),
    );
  });

  refetchHomePageEvents$ = createEffect(() => {
    const refetchActions$ = this.actions$.pipe(
      ofType(
        EventsActions.addEventSucceeded,
        EventsActions.updateEventSucceeded,
        EventsActions.deleteEventSucceeded,
      ),
    );

    const periodicCheck$ = timer(3 * 1000, 60 * 1000).pipe(
      switchMap(() =>
        this.store.select(EventsSelectors.selectLastHomePageFetch).pipe(take(1)),
      ),
      filter(lastFetch => isExpired(lastFetch)),
    );

    return merge(refetchActions$, periodicCheck$).pipe(
      map(() => EventsActions.fetchHomePageEventsRequested()),
    );
  });

  refetchFilteredEvents$ = createEffect(() => {
    const refetchActions$ = this.actions$.pipe(
      ofType(
        EventsActions.addEventSucceeded,
        EventsActions.updateEventSucceeded,
        EventsActions.deleteEventSucceeded,
        EventsActions.paginationOptionsChanged,
      ),
    );

    const periodicCheck$ = timer(3 * 1000, 60 * 1000).pipe(
      switchMap(() =>
        this.store.select(EventsSelectors.selectLastFilteredFetch).pipe(take(1)),
      ),
      filter(lastFetch => isExpired(lastFetch)),
    );

    return merge(refetchActions$, periodicCheck$).pipe(
      map(() => EventsActions.fetchFilteredEventsRequested()),
    );
  });

  fetchEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.fetchEventRequested),
      switchMap(({ eventId }) => {
        return this.eventsApiService.getEvent(eventId).pipe(
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

        return this.eventsApiService.addEvent(event).pipe(
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

        return this.eventsApiService.updateEvent(updatedEvent).pipe(
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
        this.eventsApiService.deleteEvent(event.id).pipe(
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
    private readonly eventsApiService: EventsApiService,
    private readonly store: Store,
  ) {}
}
