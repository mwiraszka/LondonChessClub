import moment from 'moment-timezone';

import { FormControl } from '@angular/forms';

import { Id, IsoDate } from './core.model';
import type { ModificationInfo } from './modification-info.model';

export interface Member {
  id: Id | null;
  firstName: string;
  lastName: string;
  city: string;
  rating: string;
  peakRating: string;
  dateJoined: IsoDate;
  isActive: boolean;
  chesscomUsername: string;
  lichessUsername: string;
  yearOfBirth: string;
  email: string;
  phoneNumber: string;
  modificationInfo: ModificationInfo | null;
}

export type MemberFormData = Omit<Member, 'id' | 'modificationInfo'>;

export type MemberFormGroup<MemberFormData> = {
  [Property in keyof MemberFormData]: FormControl<MemberFormData[Property]>;
};

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
