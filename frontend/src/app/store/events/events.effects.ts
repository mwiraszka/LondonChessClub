import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { combineLatest, merge, of, race, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
} from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { DataPaginationOptions, Event } from '@app/models';
import { EventsApiService } from '@app/services';
import { AppActions } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { NavSelectors } from '@app/store/nav';
import { exportDataToCsv, isDefined, isExpired, parseError } from '@app/utils';

import { EventsActions, EventsSelectors } from '.';

@Injectable()
export class EventsEffects {
  fetchAllEvents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.fetchAllEventsRequested),
      switchMap(() =>
        this.eventsApiService.getAllEvents().pipe(
          map(response =>
            EventsActions.fetchAllEventsSucceeded({
              events: response.data.items,
              totalCount: response.data.totalCount,
            }),
          ),
          catchError(error =>
            of(EventsActions.fetchAllEventsFailed({ error: parseError(error) })),
          ),
        ),
      ),
    );
  });

  fetchHomePageEvents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        EventsActions.fetchHomePageEventsRequested,
        EventsActions.fetchHomePageEventsInBackgroundRequested,
      ),
      switchMap(() => {
        const options: DataPaginationOptions<Event> = {
          page: 1,
          pageSize: 10,
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

        return race(
          this.eventsApiService.getFilteredEvents(options).pipe(
            map(response =>
              EventsActions.fetchHomePageEventsSucceeded({
                events: response.data.items,
                totalCount: response.data.totalCount,
              }),
            ),
            catchError(error =>
              of(EventsActions.fetchHomePageEventsFailed({ error: parseError(error) })),
            ),
          ),
          timer(10_000).pipe(map(() => EventsActions.requestTimedOut())),
        );
      }),
    );
  });

  fetchFilteredEvents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        EventsActions.fetchFilteredEventsRequested,
        EventsActions.fetchFilteredEventsInBackgroundRequested,
      ),
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
        AppActions.refreshAppRequested,
        EventsActions.addEventSucceeded,
        EventsActions.updateEventSucceeded,
        EventsActions.deleteEventSucceeded,
      ),
    );

    const periodicCheck$ = timer(3500, 10 * 60 * 1000).pipe(
      switchMap(() =>
        this.store.select(EventsSelectors.selectLastHomePageFetch).pipe(take(1)),
      ),
      filter(lastFetch => isExpired(lastFetch)),
    );

    return merge(refetchActions$, periodicCheck$).pipe(
      map(() => EventsActions.fetchHomePageEventsInBackgroundRequested()),
    );
  });

  refetchFilteredEvents$ = createEffect(() => {
    const refetchActions$ = this.actions$.pipe(
      ofType(
        AppActions.refreshAppRequested,
        EventsActions.addEventSucceeded,
        EventsActions.updateEventSucceeded,
        EventsActions.deleteEventSucceeded,
        EventsActions.paginationOptionsChanged,
      ),
    );

    const timerCheck$ = timer(5000, 10 * 60 * 1000).pipe(
      switchMap(() =>
        combineLatest([
          this.store.select(EventsSelectors.selectLastFilteredFetch),
          this.store.select(NavSelectors.selectCurrentPath),
        ]).pipe(take(1)),
      ),
      filter(
        ([lastFetch, currentPath]) =>
          isExpired(lastFetch) &&
          !!(currentPath?.includes('/schedule') || currentPath?.includes('/event')),
      ),
    );

    const routerCheck$ = this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => {
        const url = payload.event.url;
        return url.includes('/schedule') || url.includes('/event');
      }),
      switchMap(() =>
        this.store.select(EventsSelectors.selectLastFilteredFetch).pipe(take(1)),
      ),
      filter(lastFetch => isExpired(lastFetch)),
    );

    const periodicCheck$ = merge(timerCheck$, routerCheck$);

    return merge(refetchActions$, periodicCheck$).pipe(
      map(() => EventsActions.fetchFilteredEventsInBackgroundRequested()),
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
      concatMap(([, formData, user]) => {
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
      concatMap(([, event, formData, user]) => {
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
      mergeMap(({ event }) =>
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

  exportEventsToCsv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.exportEventsToCsvRequested),
      switchMap(() => {
        return this.eventsApiService.getAllEvents().pipe(
          map(response => {
            const filename = `events_export_${new Date().toISOString().split('T')[0]}.csv`;
            const exportResult = exportDataToCsv(response.data.items, filename);

            return typeof exportResult === 'number'
              ? EventsActions.exportEventsToCsvSucceeded({
                  exportedCount: exportResult,
                })
              : EventsActions.exportEventsToCsvFailed({ error: exportResult });
          }),
          catchError(error =>
            of(EventsActions.fetchAllEventsFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly eventsApiService: EventsApiService,
    private readonly store: Store,
  ) {}
}
