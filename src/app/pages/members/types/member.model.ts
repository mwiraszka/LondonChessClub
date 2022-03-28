export interface Member {
  _id: string | undefined;
  firstName: string;
  lastName: string;
  city: string;
  phoneNumber?: string;
  email: string;
  dateJoined: string;
  rating: number;
  peakRating: number;
}

export const newMemberFormTemplate: Member = {
  _id: undefined,
  firstName: '',
  lastName: '',
  city: 'London',
  phoneNumber: '',
  email: '',
  dateJoined: new Date().toISOString().substring(0, 10),
  rating: 1000,
  peakRating: 1000,
};
