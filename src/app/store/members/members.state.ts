import { ControlModes, type Member } from '@app/types';

export interface MembersState {
  members: Member[];
  selectedMember: Member | null;
  formMember: Member | null;
  controlMode: ControlModes;
  sortedBy: string;
  isAscending: boolean;
  pageNum: number;
  pageSize: number;
  showActiveOnly: boolean;
}

export const initialState: MembersState = {
  members: [],
  selectedMember: null,
  formMember: null,
  controlMode: ControlModes.VIEW,
  sortedBy: 'rating',
  isAscending: false,
  pageNum: 1,
  pageSize: 20,
  showActiveOnly: true,
};
