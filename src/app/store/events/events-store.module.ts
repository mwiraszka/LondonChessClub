import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EventsEffects } from './events.effects';
import { eventsReducer } from './events.reducer';
import { EventsState } from './events.state';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([EventsEffects]),
    StoreModule.forFeature<EventsState>('events', eventsReducer),
  ],
})
export class EventsStoreModule {}
