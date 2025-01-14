import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { appReducer } from './app.reducer';
import { AppState } from './app.state';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature<AppState>('app', appReducer)],
})
export class AppStoreModule {}
