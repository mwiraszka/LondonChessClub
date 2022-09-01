import { Member, newMemberFormTemplate } from '@app/types';

export interface MembersState {
  members: Member[];
  selectedMember: Member | null;
  isLoading: boolean;
  sortedBy: string;
  isDescending: boolean;
  memberBeforeEdit: Member;
  memberCurrently: Member;
  isEditMode: boolean;
}

export const initialState: MembersState = {
  members: [],
  selectedMember: null,
  isLoading: false,
  sortedBy: 'rating',
  isDescending: true,
  memberBeforeEdit: newMemberFormTemplate,
  memberCurrently: newMemberFormTemplate,
  isEditMode: false,
};
