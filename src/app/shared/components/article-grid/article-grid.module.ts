import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { StoreModule } from '@ngrx/store';

import { DirectivesModule } from '@app/shared/directives';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { ArticleGridComponent } from './article-grid.component';
import { reducer } from './store/article-grid.reducer';

@NgModule({
  declarations: [ArticleGridComponent],
  imports: [
    ClarityModule,
    CommonModule,
    DirectivesModule,
    StoreModule.forFeature(AppStoreFeatureTypes.ARTICLE_GRID, reducer),
  ],
  exports: [ArticleGridComponent],
})
export class ArticleGridModule {}
