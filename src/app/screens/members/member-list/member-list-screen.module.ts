import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AdminControlsModule } from '@app/shared/components/admin-controls';
import { LinkListModule } from '@app/shared/components/link-list';
import { PaginatorModule } from '@app/shared/components/paginator';
import { ScreenHeaderModule } from '@app/shared/components/screen-header';
import { TooltipModule } from '@app/shared/components/tooltip';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { MemberListScreenComponent } from './member-list-screen.component';
import { MemberListScreenEffects } from './store/member-list-screen.effects';
import { reducer } from './store/member-list-screen.reducer';

@NgModule({
  declarations: [MemberListScreenComponent],
  imports: [
    AdminControlsModule,
    ClarityModule,
    CommonModule,
    EffectsModule.forFeature([MemberListScreenEffects]),
    LinkListModule,
    PaginatorModule,
    ReactiveFormsModule,
    RouterModule,
    ScreenHeaderModule,
    StoreModule.forFeature(AppStoreFeatureTypes.MEMBER_LIST_SCREEN, reducer),
    TooltipModule,
  ],
  exports: [MemberListScreenComponent],
})
export class MemberListScreenModule {}
