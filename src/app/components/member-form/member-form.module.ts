import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from '@app/components/tooltip';

import { MemberFormComponent } from './member-form.component';

@NgModule({
  declarations: [MemberFormComponent],
  imports: [CommonModule, ReactiveFormsModule, TooltipModule],
  exports: [MemberFormComponent],
})
export class MemberFormModule {}
