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
  dateCreated: string;
  dateEdited: string;
  eventDate: string;
  title: string;
  details: string;
  type: ClubEventTypes;
}

export const newClubEventFormTemplate: ClubEvent = {
  id: undefined,
  dateCreated: new Date().toLocaleDateString(),
  dateEdited: new Date().toLocaleDateString(),
  eventDate: '',
  title: '',
  details: '',
  type: ClubEventTypes.BLITZ_TOURNAMENT,
};
