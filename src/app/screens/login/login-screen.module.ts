import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoginFormModule } from '@app/components/login-form';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { LoginScreenRoutingModule } from './login-screen-routing.module';
import { LoginScreenComponent } from './login-screen.component';

@NgModule({
  declarations: [LoginScreenComponent],
  imports: [CommonModule, LoginFormModule, LoginScreenRoutingModule, ScreenHeaderModule],
  exports: [LoginScreenComponent],
})
export class LoginScreenModule {}
