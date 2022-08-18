import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';

import { ArticleGridModule } from '@app/shared/components/article-grid';
import { ScreenHeaderModule } from '@app/shared/components/screen-header';
import { TooltipModule } from '@app/shared/components/tooltip';

import { ArticleListScreenComponent } from './article-list-screen.component';
import { ArticleGridEffects } from '../../../shared/components/article-grid/store/article-grid.effects';

@NgModule({
  declarations: [ArticleListScreenComponent],
  imports: [
    ArticleGridModule,
    ClarityModule,
    CommonModule,
    EffectsModule.forFeature([ArticleGridEffects]),
    ReactiveFormsModule,
    RouterModule,
    ScreenHeaderModule,
    TooltipModule,
  ],
  exports: [ArticleListScreenComponent],
})
export class ArticleListScreenModule {}
