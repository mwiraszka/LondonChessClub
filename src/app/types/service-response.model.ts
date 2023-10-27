import { Article } from './article.model';
import { ClubEvent } from './club-event.model';
import { ImageId } from './image-id.model';
import { Member } from './member.model';

type PayloadType =
  | Article
  | Article[]
  | Member
  | Member[]
  | ClubEvent
  | ClubEvent[]
  | ImageId;

export interface ServiceResponse<T = PayloadType> {
  error?: Error;
  payload?: T;
}
