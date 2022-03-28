import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppStoreFeatures } from '@app/shared/types';

import { MemberEditorComponent } from './member-editor.component';
import { MemberEditorEffects } from './store/member-editor.effects';
import { reducer } from './store/member-editor.reducer';

@NgModule({
  declarations: [MemberEditorComponent],
  imports: [
    ClarityModule,
    CommonModule,
    EffectsModule.forFeature([MemberEditorEffects]),
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature(AppStoreFeatures.MEMBER_EDITOR, reducer),
  ],
  exports: [MemberEditorComponent],
})
export class MemberEditorModule {}
