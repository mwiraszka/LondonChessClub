import { Observable } from 'rxjs';

export interface EditorPage {
  entity: 'article' | 'event' | 'image' | 'images' | 'member' | 'members';
  viewModel$?: Observable<{
    hasUnsavedChanges: boolean | null;
  }>;
}
