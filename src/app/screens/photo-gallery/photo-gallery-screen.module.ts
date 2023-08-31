import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LinkListModule } from '@app/components/link-list';
import { PhotoGridModule } from '@app/components/photo-grid';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { PhotoGalleryScreenComponent } from './photo-gallery-screen.component';

@NgModule({
  declarations: [PhotoGalleryScreenComponent],
  imports: [CommonModule, LinkListModule, PhotoGridModule, ScreenHeaderModule],
})
export class PhotoGalleryScreenModule {}
