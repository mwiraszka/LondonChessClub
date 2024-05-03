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
  eventDate: string;
  title: string;
  details: string;
  associatedArticleId: string;
  modificationInfo: ModificationInfo | null;
}

export const newClubEventFormTemplate: ClubEvent = {
  id: null,
  type: ClubEventTypes.BLITZ_TOURNAMENT,
  eventDate: '',
  title: '',
  details: '',
  associatedArticleId: '',
  modificationInfo: null,
};

// Backend representation of the type
export interface FlatClubEvent {
  id: string | null;
  type: ClubEventTypes;
  eventDate: string;
  title: string;
  details: string;
  associatedArticleId: string;
  dateCreated: string;
  createdBy: string;
  dateLastEdited: string;
  lastEditedBy: string;
}
