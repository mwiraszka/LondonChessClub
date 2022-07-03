export interface Member {
  id: string | undefined;
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  phoneNumber: string;
  dateOfBirth?: string;
  rating: number;
  peakRating: number;
  dateJoined: string;
}

export const newMemberFormTemplate: Member = {
  id: undefined,
  email: '',
  firstName: '',
  lastName: '',
  city: 'London',
  phoneNumber: '',
  dateOfBirth: '',
  rating: 1000,
  peakRating: 1000,
  dateJoined: new Date().toISOString().substring(0, 10),
};
