import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ToastModule } from '@app/shared/components/toast';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { ToasterEffects } from './store/toaster.effects';
import { reducer } from './store/toaster.reducer';
import { ToasterComponent } from './toaster.component';

@NgModule({
  declarations: [ToasterComponent],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ToasterEffects]),
    StoreModule.forFeature(AppStoreFeatureTypes.TOASTER, reducer),
    ToastModule,
  ],
  exports: [ToasterComponent],
})
export class ToasterModule {}
