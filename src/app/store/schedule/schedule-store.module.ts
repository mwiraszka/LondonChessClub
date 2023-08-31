import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppStoreFeatureTypes } from '@app/types';

import { ScheduleEffects } from './schedule.effects';
import { reducer } from './schedule.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ScheduleEffects]),
    StoreModule.forFeature(AppStoreFeatureTypes.SCHEDULE, reducer),
  ],
})
export class ScheduleStoreModule {}
