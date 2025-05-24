import { Observable } from 'rxjs';

export type EntityName = 'article' | 'event' | 'member';

export interface EditorPage {
  entityName: EntityName;
  viewModel$?: Observable<{
    hasUnsavedChanges: boolean;
  }>;
}
