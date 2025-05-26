import { Observable } from 'rxjs';

export type EntityName = 'article' | 'event' | 'image' | 'member';

export interface EditorPage {
  entityName: EntityName;
  viewModel$?: Observable<{
    hasUnsavedChanges: boolean;
  }>;
}
