import { FeatherModule } from 'angular-feather';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ScreenHeaderComponent } from './screen-header.component';

@NgModule({
  declarations: [ScreenHeaderComponent],
  imports: [CommonModule, FeatherModule],
  exports: [ScreenHeaderComponent],
})
export class ScreenHeaderModule {}
