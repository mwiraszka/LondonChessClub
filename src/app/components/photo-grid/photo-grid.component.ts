import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { ImageViewerComponent } from '@app/components/image-viewer/image-viewer.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { AdminControlsConfig, Image, InternalLink } from '@app/models';
import { DialogService } from '@app/services';
import { ImagesActions } from '@app/store/images';
import { customSort } from '@app/utils';

@Component({
  selector: 'lcc-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrl: './photo-grid.component.scss',
  imports: [AdminControlsDirective, CommonModule, LinkListComponent],
})
export class PhotoGridComponent implements OnInit {
  @Input({ required: true }) public isAdmin!: boolean;
  @Input({ required: true }) public photoImages!: Image[];
  @Input() public maxAlbums?: number;

  public readonly addImageLink: InternalLink = {
    internalPath: ['image', 'add'],
    text: 'Add an image',
    icon: 'plus-circle',
  };

  get albumCovers(): Image[] {
    return this.photoImages.filter(image => !isEmpty(image.coverForAlbum));
  }

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(ImagesActions.fetchImageThumbnailsRequested());
  }

  public async onClickAlbumCover(album: string): Promise<void> {
    await this.dialogService.open<ImageViewerComponent, null>({
      componentType: ImageViewerComponent,
      isModal: true,
      inputs: {
        images: this.photoImages
          .filter(image => image.albums.includes(album))
          .sort((a, b) => customSort(a, b, 'caption')),
        isAdmin: this.isAdmin,
      },
    });
  }

  public getAdminControlsConfig(album: string): AdminControlsConfig {
    return {
      buttonSize: 34,
      deleteCb: () => {},
      editPath: ['images', 'edit', album],
      isEditDisabled: true,
      isDeleteDisabled: true,
      editDisabledReason: 'Album controls currently unavailable',
      deleteDisabledReason: 'Album controls currently unavailable',
      itemName: album,
    };
  }

  public getAlbumPhotoCount(album: string): string {
    const photoCount = this.photoImages.filter(image =>
      image.albums.includes(album),
    ).length;

    return `${photoCount} PHOTO${photoCount === 1 ? '' : 'S'}`;
  }
}
