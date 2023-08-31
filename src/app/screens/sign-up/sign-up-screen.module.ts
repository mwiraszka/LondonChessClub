import { ClarityModule } from '@clr/angular';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ScreenHeaderModule } from '@app/components/screen-header';
import { TooltipModule } from '@app/components/tooltip';
import { PipesModule } from '@app/pipes';

import { SignUpScreenComponent } from './sign-up-screen.component';

@NgModule({
  declarations: [SignUpScreenComponent],
  imports: [
    ClarityModule,
    CommonModule,
    FormsModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule,
    ScreenHeaderModule,
    TooltipModule,
  ],
  exports: [SignUpScreenComponent],
})
export class SignUpScreenModule {}
