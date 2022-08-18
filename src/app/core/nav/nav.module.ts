import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { TooltipModule } from '@app/shared/components/tooltip';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { NavComponent } from './nav.component';
import { NavEffects } from './store/nav.effects';
import { reducer } from './store/nav.reducer';

@NgModule({
  declarations: [NavComponent],
  imports: [
    ClarityModule,
    CommonModule,
    EffectsModule.forFeature([NavEffects]),
    RouterModule,
    StoreModule.forFeature(AppStoreFeatureTypes.NAV, reducer),
    TooltipModule,
  ],
  exports: [NavComponent],
})
export class NavModule {}
