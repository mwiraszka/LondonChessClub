import { Store } from '@ngrx/store';

import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
    UpperCasePipe,
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
    return this.photoImages.filter(image => image.albumCover);
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
          .filter(image => image.album === album)
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
      deleteCb: () => this.onDeleteAlbum(album),
      editPath: ['album', 'edit', album],
      isEditDisabled: false,
      isDeleteDisabled: false,
      itemName: album,
    };
  }

  public async onDeleteAlbum(album: string): Promise<void> {
    const dialog: Dialog = {
      title: 'Delete album',
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
      const imageIds = this.photoImages.map(image => image.id);
      this.store.dispatch(ImagesActions.deleteAlbumRequested({ album, imageIds }));
    }
  }

  public getAlbumPhotoCountText(album: string): string {
    const photoCount = this.photoImages.filter(image => image.album === album).length;
    return `${photoCount} photo${photoCount === 1 ? '' : 's'}`;
  }
}
