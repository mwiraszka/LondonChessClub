import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DirectivesModule } from '@app/shared/directives';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { ArticleListScreenComponent } from './article-list-screen.component';
import { ArticleListScreenEffects } from './store/article-list-screen.effects';
import { reducer } from './store/article-list-screen.reducer';

@NgModule({
  declarations: [ArticleListScreenComponent],
  imports: [
    ClarityModule,
    CommonModule,
    DirectivesModule,
    EffectsModule.forFeature([ArticleListScreenEffects]),
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature(AppStoreFeatureTypes.ARTICLE_LIST_SCREEN, reducer),
  ],
  exports: [ArticleListScreenComponent],
})
export class ArticleListScreenModule {}
