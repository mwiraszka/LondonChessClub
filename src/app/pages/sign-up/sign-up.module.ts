import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { DirectivesModule } from '@app/shared/directives';

import { SignUpComponent } from './sign-up.component';

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    ClarityModule,
    CommonModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [SignUpComponent],
})
export class SignUpModule {}
