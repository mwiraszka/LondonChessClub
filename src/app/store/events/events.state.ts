import type { ControlMode, Event } from '@app/types';

export interface EventsState {
  events: Event[];
  setEvent: Event | null;
  formEvent: Event | null;
  controlMode: ControlMode | null;
  showPastEvents: boolean;
}

export const initialState: EventsState = {
  events: [],
  setEvent: null,
  formEvent: null,
  controlMode: null,
  showPastEvents: false,
};
