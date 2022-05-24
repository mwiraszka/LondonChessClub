import { Article } from '@app/pages/articles';
import { Member } from '@app/pages/members';

export interface ServiceResponse {
  error?: Error;
  payload?: {
    article?: Article;
    articles?: Article[];
    member?: Member;
    members?: Member[];
  };
}
