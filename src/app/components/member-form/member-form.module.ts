import { FeatherModule } from 'angular-feather';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from '@app/components/tooltip';

import { MemberFormComponent } from './member-form.component';

@NgModule({
  declarations: [MemberFormComponent],
  imports: [CommonModule, FeatherModule, ReactiveFormsModule, TooltipModule],
  exports: [MemberFormComponent],
})
export class MemberFormModule {}
