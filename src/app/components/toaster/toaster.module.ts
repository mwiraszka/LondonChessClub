import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ToastModule } from '@app/components/toast';

import { ToasterComponent } from './toaster.component';

@NgModule({
  declarations: [ToasterComponent],
  imports: [CommonModule, ToastModule],
  exports: [ToasterComponent],
})
export class ToasterModule {}
