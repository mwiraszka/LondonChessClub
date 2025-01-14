import moment from 'moment-timezone';

import type { MemberFormData } from '@app/models';

export const newMemberFormTemplate: MemberFormData = {
  firstName: '',
  lastName: '',
  city: 'London',
  rating: '1000/0',
  peakRating: '1000/0',
  dateJoined: moment().toISOString(),
  isActive: true,
  chessComUsername: '',
  lichessUsername: '',
  yearOfBirth: '',
  email: '',
  phoneNumber: '',
};
