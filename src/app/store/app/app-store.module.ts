import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppEffects } from './app.effects';
import { AppState, appReducer } from './app.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([AppEffects]),
    StoreModule.forFeature<AppState>('appState', appReducer),
  ],
})
export class AppStoreModule {}
