import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DirectivesModule } from '@app/shared/directives';
import { AppStoreFeatures } from '@app/shared/types';

import { ArticleEditorComponent } from './article-editor.component';
import { ArticleEditorEffects } from './store/article-editor.effects';
import { reducer } from './store/article-editor.reducer';

@NgModule({
  declarations: [ArticleEditorComponent],
  imports: [
    ClarityModule,
    CommonModule,
    DirectivesModule,
    EffectsModule.forFeature([ArticleEditorEffects]),
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature(AppStoreFeatures.ARTICLE_EDITOR, reducer),
  ],
  exports: [ArticleEditorComponent],
})
export class ArticleEditorModule {}
