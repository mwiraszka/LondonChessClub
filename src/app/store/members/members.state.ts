import { Member, newMemberFormTemplate } from '@app/types';

export interface MembersState {
  members: Member[];
  selectedMember: Member | null;
  memberCurrently: Member;
  memberBeforeEdit: Member;
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
  memberCurrently: newMemberFormTemplate,
  memberBeforeEdit: newMemberFormTemplate,
  isLoading: false,
  isEditMode: false,
  sortedBy: 'rating',
  isAscending: false,
  pageNum: 1,
  pageSize: 20,
  showActiveOnly: true,
};
