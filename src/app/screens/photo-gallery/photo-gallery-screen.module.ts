import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { PhotoGalleryScreenComponent } from '@app/screens/photo-gallery';

@NgModule({
  declarations: [PhotoGalleryScreenComponent],
  imports: [ClarityModule, CommonModule],
})
export class PhotoGalleryScreenModule {}
