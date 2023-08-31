import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TooltipModule } from '@app/components/tooltip';

import { ChangePasswordFormComponent } from './change-password-form.component';

@NgModule({
  declarations: [ChangePasswordFormComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, TooltipModule],
  exports: [ChangePasswordFormComponent],
})
export class ChangePasswordFormModule {}
