import { type ClubEvent, ControlModes } from '@app/types';

export interface ScheduleState {
  events: ClubEvent[];
  setEvent: ClubEvent | null;
  formEvent: ClubEvent | null;
  controlMode: ControlModes | null;
  nextEventId: string | null;
  showPastEvents: boolean;
}

export const initialState: ScheduleState = {
  events: [],
  setEvent: null,
  formEvent: null,
  controlMode: null,
  nextEventId: null,
  showPastEvents: false,
};
