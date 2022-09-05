import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoginFormModule } from '@app/components/login-form';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { LoginScreenComponent } from './login-screen.component';
@NgModule({
  declarations: [LoginScreenComponent],
  imports: [CommonModule, LoginFormModule, ScreenHeaderModule],
  exports: [LoginScreenComponent],
})
export class LoginScreenModule {}
