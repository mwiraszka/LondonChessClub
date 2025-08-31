import { Article } from './article.model';
import { Event } from './event.model';
import { Image } from './image.model';
import { Member } from './member.model';

export type EntityType = Article | Event | Image | Member;

const entities = ['article', 'event', 'image', 'album', 'member'] as const;

export type Entity = (typeof entities)[number];

export function isEntity(value: unknown): value is Entity {
  return entities.indexOf(value as Entity) !== -1;
}
