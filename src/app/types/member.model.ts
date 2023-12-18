import moment from 'moment';

import { ModificationInfo } from '@app/types';

export interface Member {
  id: string | undefined;
  firstName?: string;
  lastName?: string;
  city: string;
  rating: string;
  peakRating: string;
  dateJoined: string;
  isActive: boolean | string; // Stored as a string in DynamoDB
  chesscomUsername?: string;
  lichessUsername?: string;
  yearOfBirth?: string;
  email?: string;
  phoneNumber?: string;
  modificationInfo: ModificationInfo | null;
}

export const newMemberFormTemplate: Member = {
  id: undefined,
  city: 'London',
  rating: '1000/0',
  peakRating: '(provisional)',
  dateJoined: moment().subtract(5, 'hours').toISOString().split('T')[0],
  isActive: true,
  modificationInfo: null,
};

// Backend representation of the type
export interface FlatMember {
  id: string | undefined;
  firstName?: string;
  lastName?: string;
  city: string;
  rating: string;
  peakRating: string;
  dateJoined: string;
  isActive: boolean | string; // Stored as a string in DynamoDB
  chesscomUsername?: string;
  lichessUsername?: string;
  yearOfBirth?: string;
  email?: string;
  phoneNumber?: string;
  dateCreated: string;
  createdBy: string;
  dateLastEdited: string;
  lastEditedBy: string;
}
