import { Pixels } from './core.model';
import { InternalPath } from './link.model';

export interface AdminControlsConfig {
  buttonSize: Pixels;
  bookmarkCb?: () => void;
  editPath?: InternalPath;
  editInNewTab?: boolean;
  deleteCb: () => void;
  isDeleteDisabled?: boolean;
  deleteDisabledReason?: string;
  itemName?: string;
  bookmarked?: boolean;
}
