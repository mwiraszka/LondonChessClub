import { ClubEvent, newClubEventFormTemplate } from '@app/types';

export interface ScheduleState {
  events: ClubEvent[];
  selectedEvent: ClubEvent | null;
  eventBeforeEdit: ClubEvent;
  eventCurrently: ClubEvent;
  isEditMode: boolean;
  nextEventId: string | null;
}

export const initialState: ScheduleState = {
  events: [],
  selectedEvent: null,
  eventBeforeEdit: newClubEventFormTemplate,
  eventCurrently: newClubEventFormTemplate,
  isEditMode: false,
  nextEventId: null,
};
