import { ClubEvent, ClubEventTypes } from './types/club-event.model';

export const MOCK_EVENTS: ClubEvent[] = [
  {
    date: 'July 7, 2022',
    title: 'Blitz tournament',
    type: ClubEventTypes.BLITZ_TOURNAMENT,
    description: '6 rounds of 10+0 blitz chess (no entry fee; club rated)',
  },
  {
    date: 'July 14, 2022',
    title: 'Blitz tournament',
    type: ClubEventTypes.BLITZ_TOURNAMENT,
    description: '6 rounds of 10+0 blitz chess (no entry fee; club rated)',
  },
  {
    date: 'July 21, 2022',
    title: 'Blitz tournament',
    type: ClubEventTypes.BLITZ_TOURNAMENT,
    description: '6 rounds of 10+0 blitz chess (no entry fee; club rated)',
  },
  {
    date: 'July 27, 2022',
    title: 'Carl Ehrman lecture & casual blitz night',
    type: ClubEventTypes.BLITZ_TOURNAMENT && ClubEventTypes.CASUAL,
    description:
      'Carl Ehrman lecture on endgame tactics, followed by casual blitz for the remainder of the evening',
  },
  {
    date: 'August 4, 2022',
    title: 'Blitz tournament',
    type: ClubEventTypes.BLITZ_TOURNAMENT,
    description: '6 rounds of 10+0 blitz chess (no entry fee; club rated)',
  },
  {
    date: 'August 11, 2022',
    title: 'Blitz tournament',
    type: ClubEventTypes.BLITZ_TOURNAMENT,
    description: '6 rounds of 10+0 blitz chess (no entry fee; club rated)',
  },
  {
    date: 'August 18, 2022',
    title: 'LCC Club Championship - Qualifier, Rounds I & II',
    type: ClubEventTypes.ACTIVE_TOURNAMENT,
    description: `
      Rounds I & II of the LCC Club Championship ($10 entry fee; qualifier is optional for the 
      LCC Club Championship but top 8 finishers automatically qualify for the A-Division and 
      pay $5 less for the Playoffs)`,
  },
  {
    date: 'August 25, 2022',
    title: 'LCC Club Championship - Qualifier, Rounds III & IV',
    type: ClubEventTypes.ACTIVE_TOURNAMENT,
    description: `
      Rounds III & IV of the LCC Club Championship ($10 entry fee; qualifier is optional for the 
      LCC Club Championship but top 8 finishers automatically qualify for the A-Division and 
      pay $5 less for the Playoffs)`,
  },
];
