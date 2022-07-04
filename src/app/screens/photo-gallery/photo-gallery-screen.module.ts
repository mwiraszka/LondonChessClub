import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinkListModule } from '@app/shared/components/link-list';
import { PhotoGridModule } from '@app/shared/components/photo-grid';
import { ScreenHeaderModule } from '@app/shared/components/screen-header/screen-header.module';

import { PhotoGalleryScreenComponent } from './photo-gallery-screen.component';

@NgModule({
  declarations: [PhotoGalleryScreenComponent],
  imports: [CommonModule, LinkListModule, PhotoGridModule, ScreenHeaderModule],
})
export class PhotoGalleryScreenModule {}
