import moment from 'moment-timezone';

import type { ModificationInfo } from './modification-info.model';

export enum ClubEventTypes {
  BLITZ_TOURNAMENT = 'blitz tournament',
  RAPID_TOURNAMENT = 'rapid tournament',
  ACTIVE_TOURNAMENT = 'active tournament',
  LECTURE = 'lecture',
  SIMUL = 'simul',
  CHAMPIONSHIP = 'championship',
  CLOSED = 'closed',
  OTHER = 'other',
}

export interface ClubEvent {
  id: string | null;
  type: ClubEventTypes;
  eventDate: Date;
  title: string;
  details: string;
  articleId: string | null;
  modificationInfo: ModificationInfo | null;
}

export const newClubEventFormTemplate: ClubEvent = {
  id: null,
  type: ClubEventTypes.BLITZ_TOURNAMENT,
  eventDate: moment()
    .tz('America/Toronto', false)
    .set('hours', 18)
    .set('minutes', 0)
    .toDate(),
  title: '',
  details: '',
  articleId: null,
  modificationInfo: null,
};
