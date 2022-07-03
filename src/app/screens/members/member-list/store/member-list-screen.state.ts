import { Member } from '../../types/member.model';

export interface MemberListScreenState {
  members: Member[];
  selectedMember: Member | null;
  isLoading: boolean;
  sortedBy: string;
  isAscending: boolean;
}
