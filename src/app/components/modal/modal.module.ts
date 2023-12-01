import { ClarityModule } from '@clr/angular';
import { FeatherModule } from 'angular-feather';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalComponent } from './modal.component';

@NgModule({
  declarations: [ModalComponent],
  imports: [ClarityModule, CommonModule, FeatherModule],
  exports: [ModalComponent],
})
export class ModalModule {}
