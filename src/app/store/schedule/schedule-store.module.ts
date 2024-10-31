import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StoreFeatures } from '@app/types';

import { ScheduleEffects } from './schedule.effects';
import { reducer } from './schedule.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ScheduleEffects]),
    StoreModule.forFeature(StoreFeatures.SCHEDULE, reducer),
  ],
})
export class ScheduleStoreModule {}
