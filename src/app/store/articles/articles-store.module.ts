import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppStoreFeatureTypes } from '@app/types';

import { ArticlesEffects } from './articles.effects';
import { reducer } from './articles.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ArticlesEffects]),
    StoreModule.forFeature(AppStoreFeatureTypes.ARTICLES, reducer),
  ],
})
export class ArticlesStoreModule {}
