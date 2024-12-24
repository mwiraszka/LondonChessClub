import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NavEffects } from './nav.effects';
import { navReducer } from './nav.reducer';
import { NavState } from './nav.state';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([NavEffects]),
    StoreModule.forFeature<NavState>('nav', navReducer),
  ],
})
export class NavStoreModule {}
