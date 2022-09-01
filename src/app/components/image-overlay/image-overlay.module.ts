import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { ImageOverlayComponent } from './image-overlay.component';

@NgModule({
  declarations: [ImageOverlayComponent],
  imports: [ClarityModule, CommonModule],
  exports: [ImageOverlayComponent],
})
export class ImageOverlayModule {}
