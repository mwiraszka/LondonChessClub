import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImagesEffects } from './images.effects';
import { imagesReducer } from './images.reducer';
import { ImagesState } from './images.state';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ImagesEffects]),
    StoreModule.forFeature<ImagesState>('images', imagesReducer),
  ],
})
export class ImagesStoreModule {}
