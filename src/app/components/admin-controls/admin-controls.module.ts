import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';

import { AdminControlsComponent } from './admin-controls.component';

@NgModule({
  declarations: [AdminControlsComponent],
  imports: [CommonModule, IconsModule, TooltipModule],
  exports: [AdminControlsComponent],
})
export class AdminControlsModule {}
