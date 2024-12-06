import { ControlModes, type Event } from '@app/types';

export interface ScheduleState {
  events: Event[];
  setEvent: Event | null;
  formEvent: Event | null;
  controlMode: ControlModes | null;
  showPastEvents: boolean;
}

export const initialState: ScheduleState = {
  events: [],
  setEvent: null,
  formEvent: null,
  controlMode: null,
  showPastEvents: false,
};
