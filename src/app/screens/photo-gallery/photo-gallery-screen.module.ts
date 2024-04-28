import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LinkListModule } from '@app/components/link-list';
import { PhotoGridModule } from '@app/components/photo-grid';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { PhotoGalleryScreenRoutingModule } from './photo-gallery-screen-routing.module';
import { PhotoGalleryScreenComponent } from './photo-gallery-screen.component';

@NgModule({
  declarations: [PhotoGalleryScreenComponent],
  imports: [
    CommonModule,
    LinkListModule,
    PhotoGridModule,
    PhotoGalleryScreenRoutingModule,
    ScreenHeaderModule,
  ],
})
export class PhotoGalleryScreenModule {}
