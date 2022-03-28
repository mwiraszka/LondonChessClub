import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { AlertComponent } from '@app/shared/components/alert';

@NgModule({
  declarations: [AlertComponent],
  imports: [ClarityModule, CommonModule],
  exports: [AlertComponent],
})
export class AlertModule {}
