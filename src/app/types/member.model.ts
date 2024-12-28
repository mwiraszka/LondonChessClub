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
  chessComUsername: string;
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
