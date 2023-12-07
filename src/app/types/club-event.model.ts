import { ModificationInfo } from '@app/types';

export enum ClubEventTypes {
  BLITZ_TOURNAMENT = 'blitz tournament',
  RAPID_TOURNAMENT = 'rapid tournament',
  CLASSICAL_TOURNAMENT = 'classical tournament',
  LECTURE = 'lecture',
  SIMUL = 'simul',
  CASUAL = 'casual',
  CLOSED = 'closed',
  OTHER = 'other',
}

export interface ClubEvent {
  id: string | undefined;
  eventDate: string;
  title: string;
  details: string;
  type: ClubEventTypes;
  modificationInfo: ModificationInfo | null;
}

export const newClubEventFormTemplate: ClubEvent = {
  id: undefined,
  eventDate: '',
  title: '',
  details: '',
  type: ClubEventTypes.BLITZ_TOURNAMENT,
  modificationInfo: null,
};

// Backend representation of the type
export interface FlatClubEvent {
  id: string | undefined;
  eventDate: string;
  title: string;
  details: string;
  type: ClubEventTypes;
  dateCreated: string;
  createdBy: string;
  dateLastEdited: string;
  lastEditedBy: string;
}
