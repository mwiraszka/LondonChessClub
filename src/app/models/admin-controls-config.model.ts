import { Pixels } from './core.model';
import { InternalPath } from './link.model';

export interface AdminControlsConfig {
  buttonSize: Pixels;
  bookmarkCb?: () => void;
  editPath?: InternalPath;
  deleteCb: () => void;
  isDeleteDisabled?: boolean;
  itemName?: string;
  bookmarked?: boolean;
}
