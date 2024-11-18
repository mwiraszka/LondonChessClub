import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipModule } from '@app/components/tooltip';

import { ToggleSwitchComponent } from './toggle-switch.component';

@NgModule({
  declarations: [ToggleSwitchComponent],
  imports: [CommonModule, TooltipModule],
  exports: [ToggleSwitchComponent],
})
export class ToggleSwitchModule {}
