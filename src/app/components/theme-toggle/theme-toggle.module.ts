import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipModule } from '@app/components/tooltip';

import { ThemeToggleComponent } from './theme-toggle.component';

@NgModule({
  declarations: [ThemeToggleComponent],
  imports: [CommonModule, TooltipModule],
  exports: [ThemeToggleComponent],
})
export class ThemeToggleModule {}
