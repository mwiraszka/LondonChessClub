import { Article } from './article.model';
import { ClubEvent } from './club-event.model';
import { Member } from './member.model';

export interface ServiceResponse {
  error?: Error;
  payload?: {
    article?: Article;
    articles?: Article[];
    member?: Member;
    members?: Member[];
    event?: ClubEvent;
    events?: ClubEvent[];
  };
}
