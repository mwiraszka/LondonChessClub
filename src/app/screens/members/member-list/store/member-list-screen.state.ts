import { Member } from '@app/shared/types';

export interface MemberListScreenState {
  members: Member[];
  selectedMember: Member | null;
  isLoading: boolean;
  sortedBy: string;
  isAscending: boolean;
}
