import { ClarityModule } from '@clr/angular';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertComponent } from '@app/components/alert';

@NgModule({
  declarations: [AlertComponent],
  imports: [ClarityModule, CommonModule],
  exports: [AlertComponent],
})
export class AlertModule {}
