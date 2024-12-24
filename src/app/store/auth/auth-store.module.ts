import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthEffects } from './auth.effects';
import { authReducer } from './auth.reducer';
import { AuthState } from './auth.state';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([AuthEffects]),
    StoreModule.forFeature<AuthState>('auth', authReducer),
  ],
})
export class AuthStoreModule {}
