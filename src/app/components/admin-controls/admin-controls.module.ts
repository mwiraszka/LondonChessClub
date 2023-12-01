import { FeatherModule } from 'angular-feather';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipModule } from '@app/components/tooltip';

import { AdminControlsComponent } from './admin-controls.component';

@NgModule({
  declarations: [AdminControlsComponent],
  imports: [CommonModule, FeatherModule, TooltipModule],
  exports: [AdminControlsComponent],
})
export class AdminControlsModule {}
