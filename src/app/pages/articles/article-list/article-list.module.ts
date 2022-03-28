import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppStoreFeatures } from '@app/shared/types';

import { ArticleListComponent } from './article-list.component';
import { ArticleListEffects } from './store/article-list.effects';
import { reducer } from './store/article-list.reducer';

@NgModule({
  declarations: [ArticleListComponent],
  imports: [
    ClarityModule,
    CommonModule,
    EffectsModule.forFeature([ArticleListEffects]),
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature(AppStoreFeatures.ARTICLE_LIST, reducer),
  ],
  exports: [ArticleListComponent],
})
export class ArticleListModule {}
