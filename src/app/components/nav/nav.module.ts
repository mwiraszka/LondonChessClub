import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { TooltipModule } from '@app/components/tooltip';

import { NavComponent } from './nav.component';

@NgModule({
  declarations: [NavComponent],
  imports: [ClarityModule, CommonModule, RouterModule, TooltipModule],
  exports: [NavComponent],
})
export class NavModule {}
