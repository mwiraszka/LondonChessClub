import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChangePasswordFormModule } from '@app/components/change-password-form';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { ChangePasswordScreenRoutingModule } from './change-password-screen-routing.module';
import { ChangePasswordScreenComponent } from './change-password-screen.component';

@NgModule({
  declarations: [ChangePasswordScreenComponent],
  imports: [
    ChangePasswordFormModule,
    ChangePasswordScreenRoutingModule,
    CommonModule,
    ScreenHeaderModule,
  ],
  exports: [ChangePasswordScreenComponent],
})
export class ChangePasswordScreenModule {}
