import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DirectivesModule } from '@app/shared/directives';

import { LoginComponent } from './login.component';
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [LoginComponent],
})
export class LoginModule {}
