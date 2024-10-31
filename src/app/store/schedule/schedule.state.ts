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
  controlMode: ControlModes.VIEW,
  nextEventId: null,
  showPastEvents: false,
};
