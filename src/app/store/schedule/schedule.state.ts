import { ClubEvent, newClubEventFormTemplate } from '@app/types';

export interface ScheduleState {
  events: ClubEvent[];
  selectedEvent: ClubEvent | null;
  isLoading: boolean;
  eventBeforeEdit: ClubEvent;
  eventCurrently: ClubEvent;
  isEditMode: boolean;
  highlightedEventId: string | null; // by clicking 'details' in alert
}

export const initialState: ScheduleState = {
  events: [],
  selectedEvent: null,
  isLoading: false,
  eventBeforeEdit: newClubEventFormTemplate,
  eventCurrently: newClubEventFormTemplate,
  isEditMode: false,
  highlightedEventId: null,
};
