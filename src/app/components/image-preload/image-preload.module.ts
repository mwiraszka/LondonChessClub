import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImagePreloadDirective } from './image-preload.directive';

@NgModule({
  declarations: [ImagePreloadDirective],
  imports: [CommonModule],
  exports: [ImagePreloadDirective],
})
export class ImagePreloadModule {}
