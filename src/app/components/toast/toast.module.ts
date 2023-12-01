import { FeatherModule } from 'angular-feather';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ToastComponent } from '@app/components/toast';
import { PipesModule } from '@app/pipes';

@NgModule({
  declarations: [ToastComponent],
  imports: [CommonModule, FeatherModule, PipesModule],
  exports: [ToastComponent],
})
export class ToastModule {}
