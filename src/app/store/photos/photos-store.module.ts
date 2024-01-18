import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppStoreFeatureTypes } from '@app/types';

import { reducer } from './photos.reducer';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(AppStoreFeatureTypes.PHOTOS, reducer)],
})
export class PhotosStoreModule {}
