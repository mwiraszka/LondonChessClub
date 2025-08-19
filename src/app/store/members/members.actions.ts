import { createAction, props } from '@ngrx/store';

import { DataPaginationOptions, Id, LccError, Member, MemberFormData } from '@app/models';

export const fetchMembersRequested = createAction('[Members] Fetch members requested');
export const fetchMembersSucceeded = createAction(
  '[Members] Fetch members succeeded',
  props<{ members: Member[]; filteredCount: number; totalCount: number }>(),
);
export const fetchMembersFailed = createAction(
  '[Members] Fetch members failed',
  props<{ error: LccError }>(),
);

export const fetchMemberRequested = createAction(
  '[Members] Fetch member requested',
  props<{ memberId: Id }>(),
);
export const fetchMemberSucceeded = createAction(
  '[Members] Fetch member succeeded',
  props<{ member: Member }>(),
);
export const fetchMemberFailed = createAction(
  '[Members] Fetch member failed',
  props<{ error: LccError }>(),
);

export const addAMemberSelected = createAction('[Members] Add a member selected');

export const addMemberRequested = createAction('[Members] Add member requested');
export const addMemberSucceeded = createAction(
  '[Members] Add member succeeded',
  props<{ member: Member }>(),
);
export const addMemberFailed = createAction(
  '[Members] Add member failed',
  props<{ error: LccError }>(),
);

export const updateMemberRequested = createAction(
  '[Members] Update member requested',
  props<{ memberId: Id }>(),
);
export const updateMemberSucceeded = createAction(
  '[Members] Update member succeeded',
  props<{ member: Member; originalMemberName: string }>(),
);
export const updateMemberFailed = createAction(
  '[Members] Update member failed',
  props<{ error: LccError }>(),
);

export const deleteMemberRequested = createAction(
  '[Members] Delete member requested',
  props<{ member: Member }>(),
);
export const deleteMemberSucceeded = createAction(
  '[Members] Delete member succeeded',
  props<{ memberId: Id; memberName: string }>(),
);
export const deleteMemberFailed = createAction(
  '[Members] Delete member failed',
  props<{ error: LccError }>(),
);

export const paginationOptionsChanged = createAction(
  '[Members] Pagination options changed',
  props<{ options: DataPaginationOptions<Member>; fetch: boolean }>(),
);

export const cancelSelected = createAction('[Members] Cancel selected');

export const formValueChanged = createAction(
  '[Members] Form value changed',
  props<{ memberId: Id | null; value: Partial<MemberFormData> }>(),
);

export const memberFormDataReset = createAction(
  '[Members] Member form data reset',
  props<{ memberId: Id | null }>(),
);

export const importMembersFromCsvRequested = createAction(
  '[Members] Import members from CSV requested',
  props<{ file: File }>(),
);
export const importMembersFromCsvSucceeded = createAction(
  '[Members] Import members from CSV succeeded',
  props<{ importedCount: number }>(),
);
export const importMembersFromCsvFailed = createAction(
  '[Members] Import members from CSV failed',
  props<{ error: LccError }>(),
);

export const exportMembersToCsvRequested = createAction(
  '[Members] Export members to CSV requested',
);
export const exportMembersToCsvSucceeded = createAction(
  '[Members] Export members to CSV succeeded',
  props<{ exportedCount: number }>(),
);
export const exportMembersToCsvFailed = createAction(
  '[Members] Export members to CSV failed',
  props<{ error: LccError }>(),
);
