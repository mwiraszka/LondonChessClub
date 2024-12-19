import type { ControlMode, Member } from '@app/types';

export interface MembersState {
  members: Member[];
  setMember: Member | null;
  formMember: Member | null;
  controlMode: ControlMode | null;
  sortedBy: string;
  isAscending: boolean;
  pageNum: number;
  pageSize: number;
  showActiveOnly: boolean;
}

export const initialState: MembersState = {
  members: [],
  setMember: null,
  formMember: null,
  controlMode: null,
  sortedBy: 'rating',
  isAscending: false,
  pageNum: 1,
  pageSize: 20,
  showActiveOnly: true,
};
