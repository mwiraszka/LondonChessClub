import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DirectivesModule } from '@app/shared/directives';
import { AppStoreFeatureTypes } from '@app/shared/types';

import { MemberEditorComponent } from './member-editor.component';
import { MemberEditorEffects } from './store/member-editor.effects';
import { reducer } from './store/member-editor.reducer';

@NgModule({
  declarations: [MemberEditorComponent],
  imports: [
    ClarityModule,
    CommonModule,
    DirectivesModule,
    EffectsModule.forFeature([MemberEditorEffects]),
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature(AppStoreFeatureTypes.MEMBER_EDITOR, reducer),
  ],
  exports: [MemberEditorComponent],
})
export class MemberEditorModule {}
