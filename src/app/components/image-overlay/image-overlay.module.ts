import { FeatherModule } from 'angular-feather';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImageOverlayComponent } from './image-overlay.component';

@NgModule({
  declarations: [ImageOverlayComponent],
  imports: [FeatherModule, CommonModule],
  exports: [ImageOverlayComponent],
})
export class ImageOverlayModule {}
