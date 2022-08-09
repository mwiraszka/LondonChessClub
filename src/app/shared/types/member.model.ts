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
}

export const newMemberFormTemplate: Member = {
  id: undefined,
  city: 'London',
  rating: '1000/0',
  peakRating: '(provisional)',
  dateJoined: new Date().toISOString().substring(0, 10),
  isActive: false,
};
