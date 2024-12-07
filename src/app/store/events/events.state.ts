import { ControlModes, type Event } from '@app/types';

export interface EventsState {
  events: Event[];
  setEvent: Event | null;
  formEvent: Event | null;
  controlMode: ControlModes | null;
  showPastEvents: boolean;
}

export const initialState: EventsState = {
  events: [],
  setEvent: null,
  formEvent: null,
  controlMode: null,
  showPastEvents: false,
};
