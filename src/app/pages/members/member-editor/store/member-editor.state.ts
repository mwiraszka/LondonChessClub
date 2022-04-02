import { Member } from '../../types/member.model';

export interface MemberEditorState {
  memberBeforeEdit: Member;
  memberCurrently: Member;
  isEditMode: boolean;
}
