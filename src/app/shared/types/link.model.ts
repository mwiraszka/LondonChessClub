import { NavPathTypes } from '@app/core/nav';

export interface Link {
  path: string | NavPathTypes;
  text: string;
  iconShape?: string;
}
