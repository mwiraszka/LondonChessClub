export interface Member {
  userId: string | undefined;
  firstName: string;
  lastName: string;
  city: string;
  phoneNumber: string;
  dateOfBirth?: string;
  email: string;
  dateJoined: string;
  rating: number;
  peakRating: number;
}

export const newMemberFormTemplate: Member = {
  userId: undefined,
  firstName: '',
  lastName: '',
  city: 'London',
  phoneNumber: '',
  dateOfBirth: '',
  email: '',
  dateJoined: new Date().toISOString().substring(0, 10),
  rating: 1000,
  peakRating: 1000,
};
