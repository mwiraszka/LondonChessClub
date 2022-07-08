import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { AdminControlsModule } from '@app/shared/components/admin-controls';
import { LinkListModule } from '@app/shared/components/link-list';
import { DirectivesModule } from '@app/shared/directives';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { ArticleGridComponent } from './article-grid.component';
import { reducer } from './store/article-grid.reducer';

@NgModule({
  declarations: [ArticleGridComponent],
  imports: [
    AdminControlsModule,
    CommonModule,
    LinkListModule,
    DirectivesModule,
    StoreModule.forFeature(AppStoreFeatureTypes.ARTICLE_GRID, reducer),
  ],
  exports: [ArticleGridComponent],
})
export class ArticleGridModule {}
