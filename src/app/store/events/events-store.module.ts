import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StoreFeatures } from '@app/types';

import { EventsEffects } from './events.effects';
import { reducer } from './events.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([EventsEffects]),
    StoreModule.forFeature(StoreFeatures.EVENTS, reducer),
  ],
})
export class EventsStoreModule {}
