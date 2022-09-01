import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { ToastComponent } from '@app/components/toast';
import { PipesModule } from '@app/pipes';

@NgModule({
  declarations: [ToastComponent],
  imports: [ClarityModule, CommonModule, PipesModule],
  exports: [ToastComponent],
})
export class ToastModule {}
