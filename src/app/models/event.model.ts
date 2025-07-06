import { FormControl } from '@angular/forms';

import { EVENT_FORM_DATA_PROPERTIES } from '@app/constants';

import { Id, IsoDate } from './core.model';
import type { ModificationInfo } from './modification-info.model';

const EVENT_TYPES = [
  'blitz tournament (10 mins)',
  'rapid tournament (25 mins)',
  'rapid tournament (40 mins)',
  'lecture',
  'simul',
  'championship',
  'closed',
  'other',
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export function isEventType(value: unknown): value is EventType {
  return EVENT_TYPES.indexOf(value as EventType) !== -1;
}

export interface Event {
  id: Id;
  type: EventType;
  eventDate: IsoDate;
  title: string;
  details: string;
  articleId: Id | null;
  modificationInfo: ModificationInfo;
}

export type EventFormData = Pick<Event, (typeof EVENT_FORM_DATA_PROPERTIES)[number]>;

export type EventFormGroup = {
  [Property in keyof EventFormData]: FormControl<EventFormData[Property]>;
} & { eventTime: FormControl<string> };
