import { Observable } from 'rxjs';

export interface EditorPage {
  entity: 'article' | 'event' | 'image' | 'album' | 'member' | 'members';
  viewModel$?: Observable<{
    hasUnsavedChanges: boolean | null;
  }>;
}
