import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconsModule } from '@app/icons';

import { ScreenHeaderComponent } from './screen-header.component';

@NgModule({
  declarations: [ScreenHeaderComponent],
  imports: [CommonModule, IconsModule],
  exports: [ScreenHeaderComponent],
})
export class ScreenHeaderModule {}
