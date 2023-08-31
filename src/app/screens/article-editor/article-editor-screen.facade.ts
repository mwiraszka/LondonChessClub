import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ArticlesSelectors } from '@app/store/articles';

@Injectable()
export class ArticleEditorScreenFacade {
  readonly isEditMode$ = this.store.select(ArticlesSelectors.isEditMode);

  readonly titleBeforeEdit$ = this.store
    .select(ArticlesSelectors.articleBeforeEdit)
    .pipe(map(article => article.title));

  constructor(private store: Store) {}
}
