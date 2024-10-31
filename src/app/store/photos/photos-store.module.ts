import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StoreFeatures } from '@app/types';

import { reducer } from './photos.reducer';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(StoreFeatures.PHOTOS, reducer)],
})
export class PhotosStoreModule {}
