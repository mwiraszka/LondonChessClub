import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { StoreModule } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';

import { ImageOverlayComponent } from './image-overlay.component';
import { reducer } from './store/image-overlay.reducer';

@NgModule({
  declarations: [ImageOverlayComponent],
  imports: [
    ClarityModule,
    CommonModule,
    StoreModule.forFeature(AppStoreFeatureTypes.IMAGE_OVERLAY, reducer),
  ],
  exports: [ImageOverlayComponent],
})
export class ImageOverlayModule {}
