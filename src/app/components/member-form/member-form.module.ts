import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';

import { MemberFormComponent } from './member-form.component';

@NgModule({
  declarations: [MemberFormComponent],
  imports: [CommonModule, IconsModule, ReactiveFormsModule, TooltipModule],
  exports: [MemberFormComponent],
})
export class MemberFormModule {}
