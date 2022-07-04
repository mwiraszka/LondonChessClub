import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { ScreenHeaderModule } from '@app/shared/components/screen-header';
import { DirectivesModule } from '@app/shared/directives';
import { PipesModule } from '@app/shared/pipes';

import { SignUpScreenComponent } from './sign-up-screen.component';

@NgModule({
  declarations: [SignUpScreenComponent],
  imports: [
    ClarityModule,
    CommonModule,
    DirectivesModule,
    FormsModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule,
    ScreenHeaderModule,
  ],
  exports: [SignUpScreenComponent],
})
export class SignUpScreenModule {}
