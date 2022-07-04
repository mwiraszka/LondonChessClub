import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { ScreenHeaderComponent } from './screen-header.component';

@NgModule({
  declarations: [ScreenHeaderComponent],
  imports: [ClarityModule, CommonModule],
  exports: [ScreenHeaderComponent],
})
export class ScreenHeaderModule {}
