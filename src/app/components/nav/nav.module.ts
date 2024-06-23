import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DropdownModule } from '@app/components/dropdown';
import { ThemeToggleModule } from '@app/components/theme-toggle';
import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';

import { NavComponent } from './nav.component';

@NgModule({
  declarations: [NavComponent],
  imports: [
    CommonModule,
    DropdownModule,
    IconsModule,
    RouterModule,
    ThemeToggleModule,
    TooltipModule,
  ],
  exports: [NavComponent],
})
export class NavModule {}
