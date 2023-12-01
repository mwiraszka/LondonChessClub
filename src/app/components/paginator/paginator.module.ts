import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';

import { PaginatorComponent } from './paginator.component';

@NgModule({
  declarations: [PaginatorComponent],
  imports: [CommonModule, IconsModule, TooltipModule],
  exports: [PaginatorComponent],
})
export class PaginatorModule {}
