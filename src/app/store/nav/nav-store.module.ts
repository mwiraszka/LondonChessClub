import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NavEffects } from './nav.effects';

@NgModule({
  imports: [CommonModule, EffectsModule.forFeature([NavEffects])],
})
export class NavStoreModule {}
