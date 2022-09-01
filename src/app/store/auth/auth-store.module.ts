import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/types';

import { AuthEffects } from './auth.effects';
import { reducer } from './auth.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([AuthEffects]),
    StoreModule.forFeature(AppStoreFeatureTypes.AUTH, reducer),
  ],
})
export class AuthStoreModule {}
