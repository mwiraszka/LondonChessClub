import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconsModule } from '@app/icons';

import { ImageOverlayComponent } from './image-overlay.component';

@NgModule({
  declarations: [ImageOverlayComponent],
  imports: [CommonModule, IconsModule],
  exports: [ImageOverlayComponent],
})
export class ImageOverlayModule {}
