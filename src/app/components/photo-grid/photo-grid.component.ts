import { images } from 'assets/images';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { ImageViewerComponent } from '@app/components/image-viewer/image-viewer.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { AdminControlsConfig, Image, InternalLink } from '@app/models';
import { DialogService } from '@app/services';

@Component({
  selector: 'lcc-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrl: './photo-grid.component.scss',
  imports: [AdminControlsDirective, CommonModule, LinkListComponent],
})
export class PhotoGridComponent implements OnInit {
  @Input({ required: true }) public isAdmin!: boolean;
  @Input() public maxAlbums?: number;

  public readonly images = images;
  public albumCoverImages: Image[] = [];

  public readonly addImagesLink: InternalLink = {
    internalPath: 'photo-gallery',
    text: 'Add images',
    icon: 'plus-circle',
  };

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
            !image.filename.includes('-thumb'),
        ),
        isAdmin: this.isAdmin,
      },
    });
  }

  public getAdminControlsConfig(album: string): AdminControlsConfig {
    return {
      buttonSize: 34,
      deleteCb: () => {},
      editPath: ['images', 'edit', album],
      isDeleteDisabled: true,
      deleteDisabledReason: 'Album deletion currently unavailable',
      itemName: album,
    };
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
