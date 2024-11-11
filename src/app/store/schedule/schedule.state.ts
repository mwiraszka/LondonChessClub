import { type ClubEvent, ControlModes } from '@app/types';

export interface ScheduleState {
  events: ClubEvent[];
  selectedEvent: ClubEvent | null;
  formEvent: ClubEvent | null;
  controlMode: ControlModes;
  nextEventId: string | null;
  showPastEvents: boolean;
}

export const initialState: ScheduleState = {
  events: [],
  selectedEvent: null,
  formEvent: null,
  controlMode: 'view',
  nextEventId: null,
  showPastEvents: false,
};
