import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { TooltipModule } from '@app/shared/components/tooltip';

import { PaginatorComponent } from './paginator.component';

@NgModule({
  declarations: [PaginatorComponent],
  imports: [ClarityModule, CommonModule, TooltipModule],
  exports: [PaginatorComponent],
})
export class PaginatorModule {}
