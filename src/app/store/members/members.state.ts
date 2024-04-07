import type { Member } from '@app/types';

export interface MembersState {
  members: Member[];
  selectedMember: Member | null;
  memberCurrently: Member | null;
  isEditMode: boolean | null;
  sortedBy: string;
  isAscending: boolean;
  pageNum: number;
  pageSize: number;
  showActiveOnly: boolean;
}

export const initialState: MembersState = {
  members: [],
  selectedMember: null,
  memberCurrently: null,
  isEditMode: null,
  sortedBy: 'rating',
  isAscending: false,
  pageNum: 1,
  pageSize: 20,
  showActiveOnly: true,
};
