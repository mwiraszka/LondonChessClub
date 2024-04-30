import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MemberFormModule } from '@app/components/member-form';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { MemberEditorComponent } from './member-editor.component';

@NgModule({
  declarations: [MemberEditorComponent],
  imports: [CommonModule, MemberFormModule, ScreenHeaderModule],
  exports: [MemberEditorComponent],
})
export class MemberEditorModule {}
