import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppState, appReducer } from './app.reducer';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature<AppState>('appState', appReducer)],
})
export class AppStoreModule {}
