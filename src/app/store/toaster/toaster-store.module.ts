import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppStoreFeatureTypes } from '@app/types';

import { ToasterEffects } from './toaster.effects';
import { reducer } from './toaster.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ToasterEffects]),
    StoreModule.forFeature(AppStoreFeatureTypes.TOASTER, reducer),
  ],
})
export class ToasterStoreModule {}
