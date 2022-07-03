import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DirectivesModule } from '@app/shared/directives';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { ArticleEditorScreenComponent } from './article-editor-screen.component';
import { ArticleEditorScreenEffects } from './store/article-editor-screen.effects';
import { reducer } from './store/article-editor-screen.reducer';

@NgModule({
  declarations: [ArticleEditorScreenComponent],
  imports: [
    ClarityModule,
    CommonModule,
    DirectivesModule,
    EffectsModule.forFeature([ArticleEditorScreenEffects]),
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature(AppStoreFeatureTypes.ARTICLE_EDITOR_SCREEN, reducer),
  ],
  exports: [ArticleEditorScreenComponent],
})
export class ArticleEditorScreenModule {}
