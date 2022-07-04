import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ArticleGridModule } from '@app/shared/components/article-grid';
import { ScreenHeaderModule } from '@app/shared/components/screen-header';
import { DirectivesModule } from '@app/shared/directives';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { ArticleListScreenComponent } from './article-list-screen.component';
import { ArticleGridEffects } from '../../../shared/components/article-grid/store/article-grid.effects';
import { reducer } from '../../../shared/components/article-grid/store/article-grid.reducer';

@NgModule({
  declarations: [ArticleListScreenComponent],
  imports: [
    ArticleGridModule,
    ClarityModule,
    CommonModule,
    DirectivesModule,
    EffectsModule.forFeature([ArticleGridEffects]),
    ReactiveFormsModule,
    RouterModule,
    ScreenHeaderModule,
  ],
  exports: [ArticleListScreenComponent],
})
export class ArticleListScreenModule {}
