import { Member } from '../../types/member.model';

export interface MemberEditorScreenState {
  memberBeforeEdit: Member;
  memberCurrently: Member;
  isEditMode: boolean;
}
