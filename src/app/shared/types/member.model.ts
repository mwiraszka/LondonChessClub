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

export const MOCK_MEMBERS: Member[] = [
  {
    ...newMemberFormTemplate,
    firstName: 'Michal',
    lastName: 'Wiraszka',
    rating: 1000,
  },
  {
    ...newMemberFormTemplate,
    firstName: 'Johnny',
    lastName: 'Depp',
    rating: 800,
  },
  {
    ...newMemberFormTemplate,
    firstName: 'Elton',
    lastName: 'John',
    rating: 1900,
  },
];
