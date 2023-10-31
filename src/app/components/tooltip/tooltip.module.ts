import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PipesModule } from '@app/pipes';

import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';

@NgModule({
  declarations: [TooltipComponent, TooltipDirective],
  imports: [CommonModule, PipesModule],
  exports: [TooltipDirective],
})
export class TooltipModule {}
