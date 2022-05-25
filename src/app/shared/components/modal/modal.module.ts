import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';

import { ModalComponent } from './modal.component';
import { ModalEffects } from './store/modal.effects';
import { reducer } from './store/modal.reducer';

@NgModule({
  declarations: [ModalComponent],
  imports: [
    ClarityModule,
    CommonModule,
    EffectsModule.forFeature([ModalEffects]),
    StoreModule.forFeature(AppStoreFeatureTypes.MODAL, reducer),
  ],
  exports: [ModalComponent],
})
export class ModalModule {}
