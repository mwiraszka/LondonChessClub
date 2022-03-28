import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { SuppliesComponent } from '@app/pages/supplies';

@NgModule({
  declarations: [SuppliesComponent],
  imports: [ClarityModule, CommonModule],
})
export class SuppliesModule {}
