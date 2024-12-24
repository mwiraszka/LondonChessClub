import { createAction, props } from '@ngrx/store';

import { HttpErrorResponse } from '@angular/common/http';

import type { ControlMode, Id, Member, MemberFormData } from '@app/types';

export const fetchMembersRequested = createAction('[Members] Fetch members requested');
export const fetchMembersSucceeded = createAction(
  '[Members] Fetch members succeeded',
  props<{ members: Member[] }>(),
);
export const fetchMembersFailed = createAction(
  '[Members] Fetch members failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const newMemberRequested = createAction('[Members] New member requested');
export const fetchMemberRequested = createAction(
  '[Members] Fetch member requested',
  props<{ controlMode: ControlMode; memberId: Id }>(),
);
export const fetchMemberSucceeded = createAction(
  '[Members] Fetch member succeeded',
  props<{ member: Member }>(),
);
export const fetchMemberFailed = createAction(
  '[Members] Fetch member failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const tableHeaderSelected = createAction(
  '[Members] Table header selected',
  props<{ header: string }>(),
);
export const membersSorted = createAction(
  '[Members] Members sorted',
  props<{ sortedMembers: Member[]; sortedBy: string; isAscending: boolean }>(),
);
export const pageChanged = createAction(
  '[Members] Page changed',
  props<{ pageNum: number }>(),
);
export const pageSizeChanged = createAction(
  '[Members] Page size changed',
  props<{ pageSize: number }>(),
);
export const inactiveMembersToggled = createAction('[Members] Inactive members toggled');

export const addMemberRequested = createAction('[Members] Add member requested');
export const addMemberSucceeded = createAction(
  '[Members] Add member succeeded',
  props<{ member: Member }>(),
);
export const addMemberFailed = createAction(
  '[Members] Add member failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const updateMemberRequested = createAction('[Members] Update member requested');
export const updateMemberSucceeded = createAction(
  '[Members] Update member succeeded',
  props<{ member: Member }>(),
);
export const updateMemberFailed = createAction(
  '[Members] Update member failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const deleteMemberRequested = createAction(
  '[Members] Delete member requested',
  props<{ member: Member }>(),
);
export const deleteMemberSucceeded = createAction(
  '[Members] Delete member succeeded',
  props<{ member: Member }>(),
);
export const deleteMemberFailed = createAction(
  '[Members] Delete member failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const cancelSelected = createAction('[Members] Cancel selected');

export const formValueChanged = createAction(
  '[Members] Form value changed',
  props<{ value: Partial<MemberFormData> }>(),
);

export const memberUnset = createAction('[Members] Member unset');
