import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';

import { ImageOverlayComponent } from './image-overlay.component';

@NgModule({
  declarations: [ImageOverlayComponent],
  imports: [CommonModule, IconsModule, TooltipModule],
  exports: [ImageOverlayComponent],
})
export class ImageOverlayModule {}
