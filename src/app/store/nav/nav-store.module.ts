import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StoreFeatures } from '@app/types';

import { NavEffects } from './nav.effects';
import { reducer } from './nav.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([NavEffects]),
    StoreModule.forFeature(StoreFeatures.NAV, reducer),
  ],
})
export class NavStoreModule {}
