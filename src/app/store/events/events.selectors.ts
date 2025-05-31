import { createFeatureSelector, createSelector } from '@ngrx/store';
import { pick } from 'lodash';
import moment from 'moment-timezone';

import type { Id } from '@app/models';
import { areSame } from '@app/utils';

import { EventsState, INITIAL_EVENT_FORM_DATA, eventsAdapter } from './events.reducer';

const selectEventsState = createFeatureSelector<EventsState>('eventsState');

const { selectAll: selectAllEventEntities } =
  eventsAdapter.getSelectors(selectEventsState);

export const selectAllEvents = createSelector(selectAllEventEntities, allEventEntities =>
  allEventEntities.map(entity => entity.event),
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
      allEventEntities.find(entity => entity.event.id === id)?.formData ??
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

export const selectUpcomingEvents = createSelector(selectAllEvents, allEvents =>
  allEvents.filter(event => moment(event.eventDate).add(3, 'hours').isAfter(moment())),
);

export const selectNextEvent = createSelector(selectUpcomingEvents, upcomingEvents =>
  upcomingEvents.length > 0 ? upcomingEvents[0] : null,
);

export const selectShowPastEvents = createSelector(
  selectEventsState,
  state => state.showPastEvents,
);
