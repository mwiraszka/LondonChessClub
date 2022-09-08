import { Member } from '@app/types';

export interface MembersState {
  members: Member[];
  selectedMember: Member | null;
  memberCurrently: Member | null;
  isLoading: boolean;
  isEditMode: boolean;
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
  isLoading: false,
  isEditMode: false,
  sortedBy: 'rating',
  isAscending: false,
  pageNum: 1,
  pageSize: 20,
  showActiveOnly: true,
};
