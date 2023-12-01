import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ToastComponent } from '@app/components/toast';
import { IconsModule } from '@app/icons';
import { PipesModule } from '@app/pipes';

@NgModule({
  declarations: [ToastComponent],
  imports: [CommonModule, IconsModule, PipesModule],
  exports: [ToastComponent],
})
export class ToastModule {}
