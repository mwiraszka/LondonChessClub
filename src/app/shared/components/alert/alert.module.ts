import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { StoreModule } from '@ngrx/store';

import { AlertComponent } from '@app/shared/components/alert';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { reducer } from './store/alert.reducer';

@NgModule({
  declarations: [AlertComponent],
  imports: [
    ClarityModule,
    CommonModule,
    StoreModule.forFeature(AppStoreFeatureTypes.ALERT, reducer),
  ],
  exports: [AlertComponent],
})
export class AlertModule {}
