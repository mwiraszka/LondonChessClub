import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DirectivesModule } from '@app/shared/directives';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { MemberEditorScreenComponent } from './member-editor-screen.component';
import { MemberEditorScreenEffects } from './store/member-editor-screen.effects';
import { reducer } from './store/member-editor-screen.reducer';

@NgModule({
  declarations: [MemberEditorScreenComponent],
  imports: [
    ClarityModule,
    CommonModule,
    DirectivesModule,
    EffectsModule.forFeature([MemberEditorScreenEffects]),
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature(AppStoreFeatureTypes.MEMBER_EDITOR_SCREEN, reducer),
  ],
  exports: [MemberEditorScreenComponent],
})
export class MemberEditorScreenModule {}
