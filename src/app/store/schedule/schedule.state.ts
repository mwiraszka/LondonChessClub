import { ClubEvent, newClubEventFormTemplate } from '@app/types';

export interface ScheduleState {
  events: ClubEvent[];
  selectedEvent: ClubEvent | null;
  eventCurrently: ClubEvent;
  isEditMode: boolean;
  nextEventId: string | null;
}

export const initialState: ScheduleState = {
  events: [],
  selectedEvent: null,
  eventCurrently: newClubEventFormTemplate,
  isEditMode: false,
  nextEventId: null,
};
