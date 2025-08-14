import { Article } from './article.model';
import { Event } from './event.model';
import { Image } from './image.model';
import { Member } from './member.model';

export type Entity =
  | 'article'
  | 'articles'
  | 'event'
  | 'events'
  | 'image'
  | 'images'
  | 'album'
  | 'albums'
  | 'member'
  | 'members';

export type EntityType = Article | Event | Image | Member;
