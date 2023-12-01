import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';

import { LoginFormComponent } from './login-form.component';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    IconsModule,
    ReactiveFormsModule,
    RouterModule,
    TooltipModule,
  ],
  exports: [LoginFormComponent],
})
export class LoginFormModule {}
