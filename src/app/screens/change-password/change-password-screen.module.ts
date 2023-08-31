import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChangePasswordFormModule } from '@app/components/change-password-form';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { ChangePasswordScreenComponent } from './change-password-screen.component';

@NgModule({
  declarations: [ChangePasswordScreenComponent],
  imports: [CommonModule, ChangePasswordFormModule, ScreenHeaderModule],
  exports: [ChangePasswordScreenComponent],
})
export class ChangePasswordScreenModule {}
