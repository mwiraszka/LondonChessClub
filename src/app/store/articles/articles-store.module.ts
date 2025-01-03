import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ArticlesEffects } from './articles.effects';
import { articlesReducer } from './articles.reducer';
import { ArticlesState } from './articles.state';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ArticlesEffects]),
    StoreModule.forFeature<ArticlesState>('articles', articlesReducer),
  ],
})
export class ArticlesStoreModule {}
