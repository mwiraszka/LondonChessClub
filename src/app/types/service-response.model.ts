import { Article } from './article.model';
import { ClubEvent } from './club-event.model';
import { ImageId } from './image-id.model';
import { Member } from './member.model';
import { Url } from './url.model';

type PayloadType =
  | Article
  | Article[]
  | ClubEvent
  | ClubEvent[]
  | File
  | ImageId
  | Member
  | Member[]
  | Url;

export interface ServiceResponse<T = PayloadType> {
  error?: Error;
  payload?: T;
}
