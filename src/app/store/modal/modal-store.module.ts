import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/types';

import { ModalEffects } from './modal.effects';
import { reducer } from './modal.reducer';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ModalEffects]),
    StoreModule.forFeature(AppStoreFeatureTypes.MODAL, reducer),
  ],
})
export class ModalStoreModule {}
