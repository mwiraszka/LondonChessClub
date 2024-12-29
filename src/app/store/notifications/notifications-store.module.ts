import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NotificationsEffects } from './notifications.effects';
import { appReducer } from './notifications.reducer';
import { NotificationsState } from './notifications.state';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([NotificationsEffects]),
    StoreModule.forFeature<NotificationsState>('notifications', appReducer),
  ],
})
export class NotificationsStoreModule {}
