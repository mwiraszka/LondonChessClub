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
  eventDate: new Date(), // TODO: set to current date (local timezone) at 6:00 PM
  title: '',
  details: '',
  articleId: null,
  modificationInfo: null,
};
