import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { PhotoGalleryComponent } from '@app/pages/photo-gallery';

@NgModule({
  declarations: [PhotoGalleryComponent],
  imports: [ClarityModule, CommonModule],
})
export class PhotoGalleryModule {}
