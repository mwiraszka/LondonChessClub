import { createFeatureSelector, createSelector } from '@ngrx/store';
import { pick } from 'lodash';
import moment from 'moment-timezone';

import { INITIAL_EVENT_FORM_DATA } from '@app/constants';
import { Id } from '@app/models';
import { areSame, customSort } from '@app/utils';

import { EventsState, eventsAdapter } from './events.reducer';

const selectEventsState = createFeatureSelector<EventsState>('eventsState');

export const selectCallState = createSelector(
  selectEventsState,
  state => state.callState,
);

export const selectLastHomePageFetch = createSelector(
  selectEventsState,
  state => state.lastHomePageFetch,
);

export const selectLastFilteredFetch = createSelector(
  selectEventsState,
  state => state.lastFilteredFetch,
);

export const selectHomePageEvents = createSelector(
  selectEventsState,
  state => state.homePageEvents,
);

export const selectFilteredEvents = createSelector(
  selectEventsState,
  state => state.filteredEvents,
);

export const selectOptions = createSelector(selectEventsState, state => state.options);

export const selectFilteredCount = createSelector(
  selectEventsState,
  state => state.filteredCount,
);

export const selectTotalCount = createSelector(
  selectEventsState,
  state => state.totalCount,
);

const { selectAll: selectAllEventEntities } =
  eventsAdapter.getSelectors(selectEventsState);

export const selectAllEvents = createSelector(selectAllEventEntities, allEventEntities =>
  allEventEntities?.map(entity => entity.event),
);

export const selectEventById = (id: Id | null) =>
  createSelector(
    selectAllEventEntities,
    allEventEntities =>
      allEventEntities?.find(entity => entity.event.id === id)?.event ?? null,
  );

export const selectEventFormDataById = (id: Id | null) =>
  createSelector(
    selectEventsState,
    selectAllEventEntities,
    (state, allEventEntities) =>
      allEventEntities?.find(entity => entity.event.id === id)?.formData ??
      state.newEventFormData,
  );

export const selectHasUnsavedChanges = (id: Id | null) =>
  createSelector(
    selectEventById(id),
    selectEventFormDataById(id),
    (event, eventFormData) => {
      const formPropertiesOfOriginalEvent = pick(
        event ?? INITIAL_EVENT_FORM_DATA,
        Object.getOwnPropertyNames(eventFormData),
      );

      return !areSame(formPropertiesOfOriginalEvent, eventFormData);
    },
  );

export const selectNextEvent = createSelector(selectAllEvents, allEvents => {
  return (
    allEvents
      .sort((a, b) => customSort(a, b, 'eventDate'))
      .find(event => moment(event.eventDate).add(3, 'hours').isAfter(moment())) ?? null
  );
});
