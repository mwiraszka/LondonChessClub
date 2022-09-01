import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MemberFormModule } from '@app/components/member-form';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { MemberEditorScreenComponent } from './member-editor-screen.component';

@NgModule({
  declarations: [MemberEditorScreenComponent],
  imports: [CommonModule, MemberFormModule, ScreenHeaderModule],
  exports: [MemberEditorScreenComponent],
})
export class MemberEditorScreenModule {}
