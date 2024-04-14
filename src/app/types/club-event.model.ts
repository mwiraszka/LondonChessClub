import type { ModificationInfo } from '@app/types';

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
  eventDate: string;
  title: string;
  details: string;
  type: ClubEventTypes;
  modificationInfo: ModificationInfo | null;
}

export const newClubEventFormTemplate: ClubEvent = {
  id: null,
  eventDate: '',
  title: '',
  details: '',
  type: ClubEventTypes.RAPID_TOURNAMENT,
  modificationInfo: null,
};

// Backend representation of the type
export interface FlatClubEvent {
  id: string | null;
  eventDate: string;
  title: string;
  details: string;
  type: ClubEventTypes;
  dateCreated: string;
  createdBy: string;
  dateLastEdited: string;
  lastEditedBy: string;
}
