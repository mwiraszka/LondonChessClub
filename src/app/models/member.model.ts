import { FormControl } from '@angular/forms';

import { Id, IsoDate } from './core.model';
import type { ModificationInfo } from './modification-info.model';

export interface Member {
  id: Id | null;
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

export type MemberFormData = Omit<Member, 'id' | 'modificationInfo'>;

export type MemberFormGroup = {
  [Property in keyof MemberFormData]: FormControl<MemberFormData[Property]>;
};
