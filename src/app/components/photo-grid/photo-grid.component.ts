import { Store } from '@ngrx/store';
import { take } from 'rxjs';

import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { ImageExplorerComponent } from '@app/components/image-explorer/image-explorer.component';
import { ImageViewerComponent } from '@app/components/image-viewer/image-viewer.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import {
  AdminControlsConfig,
  BasicDialogResult,
  Dialog,
  Id,
  Image,
  InternalLink,
} from '@app/models';
import { DialogService } from '@app/services';
import { ImagesActions, ImagesSelectors } from '@app/store/images';
import { customSort, isSecondsInPast } from '@app/utils';

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
    UpperCasePipe,
  ],
})
export class PhotoGridComponent implements OnChanges {
  @Input({ required: true }) public isAdmin!: boolean;
  @Input({ required: true }) public photoImages!: Image[];

  @Input() public maxAlbums?: number;

  public readonly links: InternalLink[] = [
    {
      internalPath: ['image', 'add'],
      text: 'Add an image',
      icon: 'add_circle_outline',
    },
    {
      internalPath: ['album', 'add'],
      text: 'Create an album',
      icon: 'add_circle_outline',
    },
  ];

  public get albumCovers(): Image[] {
    return this.photoImages
      .filter(image => image.albumCover)
      .map(image => ({
        ...image,
        width: image.width || 300,
        height: image.height || 300,
        caption: image.caption || 'Loading...',
      }));
  }

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store,
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['photoImages'] && this.photoImages.length) {
      this.store
        .select(ImagesSelectors.selectLastAlbumCoversFetch)
        .pipe(take(1))
        .subscribe(lastFetch => {
          const imageIds = this.albumCovers.map(image => image.id);
          if (!lastFetch || isSecondsInPast(lastFetch, 600)) {
            this.store.dispatch(
              ImagesActions.fetchBatchThumbnailsRequested({
                imageIds,
                context: 'photos',
              }),
            );
          }
        });
    }
  }

  public async onClickAlbumCover(album: string): Promise<void> {
    await this.dialogService.open<ImageViewerComponent, null>({
      componentType: ImageViewerComponent,
      isModal: true,
      inputs: {
        album,
        images: this.photoImages
          .filter(image => image.album === album)
          .sort((a, b) => customSort(a, b, 'albumOrdinality', false, 'caption', false)),
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
      deleteCb: () => this.onDeleteAlbum(album),
      editPath: ['album', 'edit', album],
      isEditDisabled: false,
      isDeleteDisabled: false,
      itemName: album,
    };
  }

  public async onDeleteAlbum(album: string): Promise<void> {
    const dialog: Dialog = {
      title: 'Confirm',
      body: `Delete ${album} and its ${this.getAlbumPhotoCountText(album)}?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open<BasicDialogComponent, BasicDialogResult>(
      {
        componentType: BasicDialogComponent,
        inputs: { dialog },
        isModal: true,
      },
    );

    if (result === 'confirm') {
      const imageIds = this.photoImages
        .filter(image => image.album === album)
        .map(image => image.id);
      this.store.dispatch(ImagesActions.deleteAlbumRequested({ album, imageIds }));
    }
  }

  public getAlbumPhotoCountText(album: string): string {
    const photoCount = this.photoImages.filter(image => image.album === album).length;
    return `${photoCount} photo${photoCount === 1 ? '' : 's'}`;
  }
}
