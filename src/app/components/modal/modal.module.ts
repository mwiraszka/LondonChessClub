import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconsModule } from '@app/icons';

import { ModalComponent } from './modal.component';

@NgModule({
  declarations: [ModalComponent],
  imports: [CommonModule, IconsModule],
  exports: [ModalComponent],
})
export class ModalModule {}
