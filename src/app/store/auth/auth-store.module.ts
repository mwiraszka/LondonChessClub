import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StoreFeatures } from '@app/types';

import { AuthEffects } from './auth.effects';
import { reducer } from './auth.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([AuthEffects]),
    StoreModule.forFeature(StoreFeatures.AUTH, reducer),
  ],
})
export class AuthStoreModule {}
