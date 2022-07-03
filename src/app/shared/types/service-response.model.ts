import { Article } from '@app/screens/articles';
import { Member } from '@app/screens/members';

export interface ServiceResponse {
  error?: Error;
  payload?: {
    article?: Article;
    articles?: Article[];
    member?: Member;
    members?: Member[];
  };
}
