import { Article } from './article.model';
import { Member } from './member.model';

export interface ServiceResponse {
  error?: Error;
  payload?: {
    article?: Article;
    articles?: Article[];
    member?: Member;
    members?: Member[];
  };
}
