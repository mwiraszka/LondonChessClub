import { FormControl } from '@angular/forms';

import { MEMBER_FORM_DATA_PROPERTIES } from '@app/constants';

import { Id, IsoDate } from './core.model';
import type { ModificationInfo } from './modification-info.model';

export interface Member {
  id: Id;
  firstName: string;
  lastName: string;
  rating: string;
  peakRating: string;
  email: string;
  phoneNumber: string;
  city: string;
  yearOfBirth: string;
  chessComUsername: string;
  lichessUsername: string;
  isActive: boolean;
  dateJoined: IsoDate;
  modificationInfo: ModificationInfo;
}

export type MemberFormData = Pick<Member, (typeof MEMBER_FORM_DATA_PROPERTIES)[number]>;

export type MemberFormGroup = {
  [Property in keyof MemberFormData]: FormControl<MemberFormData[Property]>;
};
