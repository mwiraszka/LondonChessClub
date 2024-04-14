import type { ClubEvent } from '@app/types';

export interface ScheduleState {
  events: ClubEvent[];
  selectedEvent: ClubEvent | null;
  eventCurrently: ClubEvent | null;
  isEditMode: boolean | null;
  nextEventId: string | null;
}

export const initialState: ScheduleState = {
  events: [],
  selectedEvent: null,
  eventCurrently: null,
  isEditMode: null,
  nextEventId: null,
};
