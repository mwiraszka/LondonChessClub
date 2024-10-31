import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StoreFeatures } from '@app/types';

import { ModalEffects } from './modal.effects';
import { reducer } from './modal.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ModalEffects]),
    StoreModule.forFeature(StoreFeatures.MODAL, reducer),
  ],
})
export class ModalStoreModule {}
