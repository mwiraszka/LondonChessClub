import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DirectivesModule } from '@app/shared/directives';

import { LoginScreenComponent } from './login-screen.component';
@NgModule({
  declarations: [LoginScreenComponent],
  imports: [
    CommonModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [LoginScreenComponent],
})
export class LoginScreenModule {}
