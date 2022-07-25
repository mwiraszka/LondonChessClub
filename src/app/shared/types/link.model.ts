import { NavPathTypes } from './nav-paths.model';

export interface Link {
  path: string | NavPathTypes;
  text: string;
  iconShape?: string;
}
