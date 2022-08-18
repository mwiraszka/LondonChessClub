import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ScreenHeaderModule } from '@app/shared/components/screen-header';
import { TooltipModule } from '@app/shared/components/tooltip';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { MemberEditorScreenComponent } from './member-editor-screen.component';
import { MemberEditorScreenEffects } from './store/member-editor-screen.effects';
import { reducer } from './store/member-editor-screen.reducer';

@NgModule({
  declarations: [MemberEditorScreenComponent],
  imports: [
    ClarityModule,
    CommonModule,
    EffectsModule.forFeature([MemberEditorScreenEffects]),
    ReactiveFormsModule,
    RouterModule,
    ScreenHeaderModule,
    StoreModule.forFeature(AppStoreFeatureTypes.MEMBER_EDITOR_SCREEN, reducer),
    TooltipModule,
  ],
  exports: [MemberEditorScreenComponent],
})
export class MemberEditorScreenModule {}
