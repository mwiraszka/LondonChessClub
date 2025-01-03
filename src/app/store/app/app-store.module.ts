import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppEffects } from './app.effects';
import { appReducer } from './app.reducer';
import { AppState } from './app.state';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([AppEffects]),
    StoreModule.forFeature<AppState>('app', appReducer),
  ],
})
export class AppStoreModule {}
