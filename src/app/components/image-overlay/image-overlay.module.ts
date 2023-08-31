import { ClarityModule } from '@clr/angular';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImageOverlayComponent } from './image-overlay.component';

@NgModule({
  declarations: [ImageOverlayComponent],
  imports: [ClarityModule, CommonModule],
  exports: [ImageOverlayComponent],
})
export class ImageOverlayModule {}
