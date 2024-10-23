import { NavPathTypes } from './nav-paths.model';

export interface Link {
  path: string | NavPathTypes | null;
  text: string;
  icon?: string;
  tooltip?: string;
}
