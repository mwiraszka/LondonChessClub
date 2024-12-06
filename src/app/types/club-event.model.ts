import moment from 'moment-timezone';

import { Id, IsoDate } from './core.model';
import type { ModificationInfo } from './modification-info.model';

export enum EventTypes {
  BLITZ_TOURNAMENT = 'blitz tournament',
  RAPID_TOURNAMENT = 'rapid tournament',
  ACTIVE_TOURNAMENT = 'active tournament',
  LECTURE = 'lecture',
  SIMUL = 'simul',
  CHAMPIONSHIP = 'championship',
  CLOSED = 'closed',
  OTHER = 'other',
}

export interface Event {
  id: Id | null;
  type: EventTypes;
  eventDate: IsoDate;
  title: string;
  details: string;
  articleId: Id | null;
  modificationInfo: ModificationInfo | null;
}

export const newEventFormTemplate: Event = {
  id: null,
  type: EventTypes.BLITZ_TOURNAMENT,
  eventDate: moment()
    .tz('America/Toronto', false)
    .set('hours', 18)
    .set('minutes', 0)
    .toISOString(),
  title: '',
  details: '',
  articleId: null,
  modificationInfo: null,
};
