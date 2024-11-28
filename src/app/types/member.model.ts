import type { ModificationInfo } from './modification-info.model';

export interface Member {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  city: string;
  rating: string;
  peakRating: string;
  dateJoined: Date;
  isActive: boolean | string; // Stored as a string in DynamoDB
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
  dateJoined: new Date(),
  isActive: true,
  chesscomUsername: null,
  lichessUsername: null,
  yearOfBirth: null,
  email: null,
  phoneNumber: null,
  modificationInfo: null,
};

// Backend representation of the type
export interface FlatMember {
  id: string | null;
  firstName?: string;
  lastName?: string;
  city: string;
  rating: string;
  peakRating: string;
  dateJoined: Date;
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
