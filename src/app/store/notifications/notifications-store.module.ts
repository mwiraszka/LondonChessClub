import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NotificationsEffects } from './notifications.effects';
import { NotificationsState, notificationsReducer } from './notifications.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([NotificationsEffects]),
    StoreModule.forFeature<NotificationsState>(
      'notificationsState',
      notificationsReducer,
    ),
  ],
})
export class NotificationsStoreModule {}
