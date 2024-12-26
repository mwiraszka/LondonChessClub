import moment from 'moment-timezone';

import type { MemberFormData } from '@app/types';

export const newMemberFormTemplate: MemberFormData = {
  firstName: '',
  lastName: '',
  city: 'London',
  rating: '1000/0',
  peakRating: '1000/0',
  dateJoined: moment().toISOString(),
  isActive: true,
  chesscomUsername: '',
  lichessUsername: '',
  yearOfBirth: '',
  email: '',
  phoneNumber: '',
};
