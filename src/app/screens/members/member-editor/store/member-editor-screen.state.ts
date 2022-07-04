import { Member } from '@app/shared/types';

export interface MemberEditorScreenState {
  memberBeforeEdit: Member;
  memberCurrently: Member;
  isEditMode: boolean;
}
