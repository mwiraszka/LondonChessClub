import { images } from 'assets/images';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { ImageViewerComponent } from '@app/components/image-viewer/image-viewer.component';
import { Image } from '@app/models';
import { DialogService } from '@app/services';

@Component({
  selector: 'lcc-photo-grid',
  template: `
    @for (
      image of albumCoverImages.slice(0, maxAlbums ?? images.length);
      let index = $index;
      track image.filename
    ) {
      <button
        class="album-card"
        (click)="onClickAlbumCover(image.coverForAlbum!)">
        <figure>
          <img
            [alt]="image.caption"
            [src]="getThumbnailPath(image.filename)"
            default="assets/image-placeholder.png" />
          <figcaption>
            <div class="album-name lcc-truncate-max-2-lines">{{
              image.coverForAlbum
            }}</div>
            <div class="photo-count">{{ getPhotoCount(image.coverForAlbum!) }}</div>
          </figcaption>
        </figure>
      </button>
    }
  `,
  styleUrl: './photo-grid.component.scss',
  imports: [CommonModule],
})
export class PhotoGridComponent implements OnInit {
  @Input() public maxAlbums?: number;

  public readonly images = images;
  public albumCoverImages: Image[] = [];

  constructor(private readonly dialogService: DialogService) {}

  ngOnInit(): void {
    this.albumCoverImages = this.images.filter(image => !!image.coverForAlbum);
  }

  public async onClickAlbumCover(album: string): Promise<void> {
    await this.dialogService.open<ImageViewerComponent, null>({
      componentType: ImageViewerComponent,
      isModal: true,
      inputs: {
        images: images.filter(
          image =>
            image.albums &&
            image.albums.includes(album) &&
            !image.filename.includes('-320'),
        ),
      },
    });
  }

  public getThumbnailPath(filename: string): string {
    const [name, extension] = filename.split('.');
    return `assets/images/${name}-320.${extension}`;
  }

  public getPhotoCount(album: string): string {
    const photoCount = this.images.filter(image => image.albums?.includes(album)).length;
    return `${photoCount} PHOTO${photoCount === 1 ? '' : 'S'}`;
  }
}
