import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ScreenHeaderModule } from '@app/shared/components/screen-header';
import { TooltipModule } from '@app/shared/components/tooltip';

import { LoginScreenComponent } from './login-screen.component';
@NgModule({
  declarations: [LoginScreenComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ScreenHeaderModule,
    TooltipModule,
  ],
  exports: [LoginScreenComponent],
})
export class LoginScreenModule {}
