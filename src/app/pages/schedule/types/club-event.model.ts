export interface ClubEvent {
  date: string;
  title: string;
  description: string;
  type: ClubEventTypes;
}

export enum ClubEventTypes {
  BLITZ_TOURNAMENT = 'blitz tournament',
  ACTIVE_TOURNAMENT = 'active tournament',
  LECTURE = 'lecture',
  SIMUL = 'simul',
  CASUAL = 'casual',
}
