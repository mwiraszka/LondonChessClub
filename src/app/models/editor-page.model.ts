import { Observable } from 'rxjs';

import type { Entity } from './entity.model';

export interface EditorPage {
  entity: Entity;
  viewModel$?: Observable<{
    hasUnsavedChanges: boolean;
  }>;
}
