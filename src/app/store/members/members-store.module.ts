import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MembersEffects } from './members.effects';
import { membersReducer } from './members.reducer';
import { MembersState } from './members.state';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([MembersEffects]),
    StoreModule.forFeature<MembersState>('members', membersReducer),
  ],
})
export class MembersStoreModule {}
