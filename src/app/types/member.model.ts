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
  email?: string;
  phoneNumber?: string;
  yearOfBirth?: string;
  chesscomUsername?: string;
  lichessUsername?: string;
  modificationInfo: ModificationInfo | null;
}

export const newMemberFormTemplate: Member = {
  id: undefined,
  city: 'London',
  rating: '1000/0',
  peakRating: '(provisional)',
  dateJoined: new Date().toLocaleDateString(),
  isActive: false,
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
  email?: string;
  phoneNumber?: string;
  yearOfBirth?: string;
  chesscomUsername?: string;
  lichessUsername?: string;
  dateCreated: string;
  createdBy: string;
  dateLastEdited: string;
  lastEditedBy: string;
}
