import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { ScreenHeaderComponent } from './screen-header.component';

@NgModule({
  declarations: [ScreenHeaderComponent],
  imports: [ClarityModule, CommonModule],
  exports: [ScreenHeaderComponent],
})
export class ScreenHeaderModule {}
