import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DropdownModule } from '@app/components/dropdown';
import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';

import { NavComponent } from './nav.component';

@NgModule({
  declarations: [NavComponent],
  imports: [CommonModule, DropdownModule, IconsModule, RouterModule, TooltipModule],
  exports: [NavComponent],
})
export class NavModule {}
