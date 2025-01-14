import type { ControlMode, Member, MemberFormData } from '@app/models';

export interface MembersState {
  members: Member[];
  member: Member | null;
  memberFormData: MemberFormData | null;
  controlMode: ControlMode | null;
  sortedBy: string;
  isAscending: boolean;
  pageNum: number;
  pageSize: number;
  showActiveOnly: boolean;
}

export const initialState: MembersState = {
  members: [],
  member: null,
  memberFormData: null,
  controlMode: null,
  sortedBy: 'rating',
  isAscending: false,
  pageNum: 1,
  pageSize: 20,
  showActiveOnly: true,
};
