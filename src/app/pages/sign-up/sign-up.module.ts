import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SignUpComponent } from '@app/pages/sign-up';

@NgModule({
  declarations: [SignUpComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [SignUpComponent],
})
export class SignUpModule {}
