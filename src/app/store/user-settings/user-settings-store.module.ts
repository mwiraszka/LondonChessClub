import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StoreFeatures } from '@app/types';

import { reducer } from './user-settings.reducer';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(StoreFeatures.USER_SETTINGS, reducer)],
})
export class UserSettingsStoreModule {}
