import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StoreFeatures } from '@app/types';

import { MembersEffects } from './members.effects';
import { reducer } from './members.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([MembersEffects]),
    StoreModule.forFeature(StoreFeatures.MEMBERS, reducer),
  ],
})
export class MembersStoreModule {}
