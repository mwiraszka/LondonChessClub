import { FeatherModule } from 'angular-feather';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertComponent } from '@app/components/alert';
import { PipesModule } from '@app/pipes';

@NgModule({
  declarations: [AlertComponent],
  imports: [CommonModule, FeatherModule, PipesModule],
  exports: [AlertComponent],
})
export class AlertModule {}
