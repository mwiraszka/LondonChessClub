import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppStoreFeatures } from '@app/shared/types';

import { AuthEffects } from './store/auth.effects';
import { reducer } from './store/auth.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([AuthEffects]),
    StoreModule.forFeature(AppStoreFeatures.AUTH, reducer),
  ],
})
export class AuthModule {}
