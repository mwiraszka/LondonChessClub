import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppStoreFeatureTypes } from '@app/types';

import { reducer } from './image-overlay.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(AppStoreFeatureTypes.IMAGE_OVERLAY, reducer),
  ],
})
export class ImageOverlayStoreModule {}
