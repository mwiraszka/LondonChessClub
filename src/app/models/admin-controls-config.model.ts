import { Pixels } from './core.model';
import { InternalPath } from './link.model';

export interface AdminControlsConfig {
  buttonSize: Pixels;
  deleteCb: () => void;
  bookmarkCb?: () => void;
  editPath?: InternalPath;
  itemName?: string;
  bookmarked?: boolean;
}
