import { Member } from '@app/pages/members';

export interface MembersApiResponse {
  statusCode: number;
  errorMessage?: string;
  payload?: {
    allMembers?: Member[];
    member?: Member;
    addedMember?: Member;
  };
}
