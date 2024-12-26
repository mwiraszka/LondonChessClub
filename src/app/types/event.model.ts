import moment from 'moment-timezone';

import { FormControl } from '@angular/forms';

import { Id, IsoDate } from './core.model';
import type { ModificationInfo } from './modification-info.model';

const eventTypes = [
  'blitz tournament',
  'rapid tournament',
  'active tournament',
  'lecture',
  'simul',
  'championship',
  'closed',
  'other',
] as const;
export type EventType = (typeof eventTypes)[number];

export function isEventType(value: unknown): value is EventType {
  return eventTypes.indexOf(value as EventType) !== -1;
}

export interface Event {
  id: Id | null;
  type: EventType;
  eventDate: IsoDate;
  title: string;
  details: string;
  articleId: Id;
  modificationInfo: ModificationInfo | null;
}

export type EventFormData = Omit<Event, 'id' | 'modificationInfo'>;

export type EventFormGroup<EventFormData> = {
  [Property in keyof EventFormData]: FormControl<EventFormData[Property]>;
} & { eventTime: FormControl<string> };

export const newEventFormTemplate: EventFormData = {
  type: 'blitz tournament',
  eventDate: moment()
    .tz('America/Toronto', false)
    .set('hours', 18)
    .set('minutes', 0)
    .toISOString(),
  title: '',
  details: '',
  articleId: '',
};
