import moment from 'moment-timezone';

import { Id, IsoDate } from './core.model';
import type { ModificationInfo } from './modification-info.model';

export interface Member {
  id: Id | null;
  firstName: string | null;
  lastName: string | null;
  city: string;
  rating: string;
  peakRating: string;
  dateJoined: IsoDate;
  isActive: boolean;
  chesscomUsername: string | null;
  lichessUsername: string | null;
  yearOfBirth: string | null;
  email: string | null;
  phoneNumber: string | null;
  modificationInfo: ModificationInfo | null;
}

export const newMemberFormTemplate: Member = {
  id: null,
  firstName: null,
  lastName: null,
  city: 'London',
  rating: '1000/0',
  peakRating: '1000/0',
  dateJoined: moment().toISOString(),
  isActive: true,
  chesscomUsername: null,
  lichessUsername: null,
  yearOfBirth: null,
  email: null,
  phoneNumber: null,
  modificationInfo: null,
};
