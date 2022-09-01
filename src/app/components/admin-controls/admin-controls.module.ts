import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { TooltipModule } from '@app/components/tooltip';

import { AdminControlsComponent } from './admin-controls.component';

@NgModule({
  declarations: [AdminControlsComponent],
  imports: [ClarityModule, CommonModule, TooltipModule],
  exports: [AdminControlsComponent],
})
export class AdminControlsModule {}
