import type { ControlMode, Event, EventFormData } from '@app/types';

export interface EventsState {
  events: Event[];
  event: Event | null;
  eventFormData: EventFormData | null;
  controlMode: ControlMode | null;
  showPastEvents: boolean;
}

export const initialState: EventsState = {
  events: [],
  event: null,
  eventFormData: null,
  controlMode: null,
  showPastEvents: false,
};
