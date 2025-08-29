import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { AdminToolbarComponent } from '@app/components/admin-toolbar/admin-toolbar.component';
import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { ImageExplorerComponent } from '@app/components/image-explorer/image-explorer.component';
import { ImageViewerComponent } from '@app/components/image-viewer/image-viewer.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import {
  AdminButton,
  AdminControlsConfig,
  BasicDialogResult,
  Dialog,
  Id,
  Image,
  InternalLink,
} from '@app/models';
import { DialogService } from '@app/services';
import { customSort } from '@app/utils';

@Component({
  selector: 'lcc-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrl: './photo-grid.component.scss',
  imports: [
    AdminControlsDirective,
    AdminToolbarComponent,
    ImagePreloadDirective,
    MatIconModule,
    UpperCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGridComponent {
  @Input({ required: true }) public isAdmin!: boolean;
  @Input({ required: true }) public photoImages!: Image[];

  @Input() public maxAlbums?: number;

  @Output() public readonly requestDeleteAlbum = new EventEmitter<string>();

  public readonly adminButtons: AdminButton[] = [
    {
      id: 'open-image-explorer',
      tooltip: 'Open image explorer',
      icon: 'image_search',
      action: () => this.onOpenImageExplorer(),
    },
  ];

  public readonly adminLinks: InternalLink[] = [
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

  constructor(private readonly dialogService: DialogService) {}

  public get albumCovers(): Image[] {
    return this.photoImages
      .filter(image => image.albumCover)
      .map(image => ({
        ...image,
        mainWidth: image.mainWidth || 300,
        mainHeight: image.mainHeight || 300,
        caption: image.caption || 'Loading...',
      }));
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
      deleteCb: () => this.onRequestDeleteAlbum(album),
      editPath: ['album', 'edit', album],
      isEditDisabled: false,
      isDeleteDisabled: false,
      itemName: album,
    };
  }

  public async onRequestDeleteAlbum(album: string): Promise<void> {
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
      this.requestDeleteAlbum.emit(album);
    }
  }

  public getAlbumPhotoCountText(album: string): string {
    const photoCount = this.photoImages.filter(image => image.album === album).length;
    return `${photoCount} photo${photoCount === 1 ? '' : 's'}`;
  }
}
