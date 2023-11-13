import { ClarityModule } from '@clr/angular';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalComponent } from './modal.component';

@NgModule({
  declarations: [ModalComponent],
  imports: [ClarityModule, CommonModule],
  exports: [ModalComponent],
})
export class ModalModule {}
