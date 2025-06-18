import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';

import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ImageExplorerComponent } from '@app/components/image-explorer/image-explorer.component';
import { ImageViewerComponent } from '@app/components/image-viewer/image-viewer.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import {
  AdminControlsDirective,
  ImagePreloadDirective,
  TooltipDirective,
} from '@app/directives';
import { AdminControlsConfig, Id, Image, InternalLink } from '@app/models';
import { DialogService } from '@app/services';
import { ImagesActions } from '@app/store/images';
import { customSort } from '@app/utils';

@Component({
  selector: 'lcc-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrl: './photo-grid.component.scss',
  imports: [
    AdminControlsDirective,
    ImagePreloadDirective,
    LinkListComponent,
    MatIconModule,
    TooltipDirective,
  ],
})
export class PhotoGridComponent implements OnInit {
  @Input({ required: true }) public isAdmin!: boolean;
  @Input({ required: true }) public photoImages!: Image[];

  @Input() public maxAlbums?: number;

  public readonly addImageLink: InternalLink = {
    internalPath: ['image', 'add'],
    text: 'Add an image',
    icon: 'add_circle_outline',
  };

  public get albumCovers(): Image[] {
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
        album,
        images: this.photoImages
          .filter(image => image.albums.includes(album))
          .sort((a, b) => customSort(a, b, 'caption')),
        isAdmin: this.isAdmin,
      },
    });
  }

  public async onOpenImageExplorer(): Promise<void> {
    await this.dialogService.open<ImageExplorerComponent, Id>({
      componentType: ImageExplorerComponent,
      inputs: { selectable: false },
      isModal: true,
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
