import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DirectivesModule } from '@app/shared/directives';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { MemberListScreenComponent } from './member-list-screen.component';
import { MemberListScreenEffects } from './store/member-list-screen.effects';
import { reducer } from './store/member-list-screen.reducer';

@NgModule({
  declarations: [MemberListScreenComponent],
  imports: [
    ClarityModule,
    CommonModule,
    DirectivesModule,
    EffectsModule.forFeature([MemberListScreenEffects]),
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature(AppStoreFeatureTypes.MEMBER_LIST_SCREEN, reducer),
  ],
  exports: [MemberListScreenComponent],
})
export class MemberListScreenModule {}
