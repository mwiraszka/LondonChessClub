import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';

import { MemberListComponent } from './member-list.component';
import { MemberListEffects } from './store/member-list.effects';
import { reducer } from './store/member-list.reducer';

@NgModule({
  declarations: [MemberListComponent],
  imports: [
    ClarityModule,
    CommonModule,
    EffectsModule.forFeature([MemberListEffects]),
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature(AppStoreFeatureTypes.MEMBER_LIST, reducer),
  ],
  exports: [MemberListComponent],
})
export class MemberListModule {}
