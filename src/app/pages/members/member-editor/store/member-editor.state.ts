import { Member } from '../../types/member.model';

export interface MemberEditorState {
  memberBeforeEdit: Member;
  memberAfterEdit?: Member;
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
}
