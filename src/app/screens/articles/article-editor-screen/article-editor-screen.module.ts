import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ScreenHeaderModule } from '@app/shared/components/screen-header';
import { TooltipModule } from '@app/shared/components/tooltip';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { ArticleEditorScreenComponent } from './article-editor-screen.component';
import { ArticleEditorScreenEffects } from './store/article-editor-screen.effects';
import { reducer } from './store/article-editor-screen.reducer';

@NgModule({
  declarations: [ArticleEditorScreenComponent],
  imports: [
    ClarityModule,
    CommonModule,
    EffectsModule.forFeature([ArticleEditorScreenEffects]),
    ReactiveFormsModule,
    RouterModule,
    ScreenHeaderModule,
    StoreModule.forFeature(AppStoreFeatureTypes.ARTICLE_EDITOR_SCREEN, reducer),
    TooltipModule,
  ],
  exports: [ArticleEditorScreenComponent],
})
export class ArticleEditorScreenModule {}
