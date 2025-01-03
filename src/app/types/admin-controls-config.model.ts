import { Pixels } from './core.model';
import { InternalPath } from './link.model';

export interface AdminControlsConfig {
  bookmarkCb?: () => void;
  bookmarked?: boolean;
  buttonSize: Pixels;
  deleteCb: () => void;
  editPath?: InternalPath;
  itemName?: string;
}
