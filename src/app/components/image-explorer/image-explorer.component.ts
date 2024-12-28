import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import * as uuid from 'uuid';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AdminControlsDirective } from '@app/components/admin-controls/admin-controls.directive';
import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import IconsModule from '@app/icons';
import { FormatBytesPipe, FormatDatePipe } from '@app/pipes';
import { DialogService, ImagesService, LoaderService } from '@app/services';
import { AppActions } from '@app/store/app';
import type {
  AdminControlsConfig,
  BasicDialogResult,
  Dialog,
  DialogOutput,
  Id,
  Image,
} from '@app/types';

@Component({
  selector: 'lcc-image-explorer',
  templateUrl: './image-explorer.component.html',
  styleUrl: './image-explorer.component.scss',
  imports: [
    AdminControlsDirective,
    CommonModule,
    FormatBytesPipe,
    FormatDatePipe,
    IconsModule,
  ],
})
export class ImageExplorerComponent implements OnInit, DialogOutput<Id> {
  public images: Image[] = this.generatePlaceholderImages(25);

  @Output() public dialogResult = new EventEmitter<Id | 'close'>();

  constructor(
    private readonly dialogService: DialogService<
      BasicDialogComponent,
      BasicDialogResult
    >,
    private readonly imagesService: ImagesService,
    private readonly loaderService: LoaderService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    // TODO: Remove imagesService dependency and handle all image-related API communication
    // through a dedicated Images store slice
    this.loaderService.setIsLoading(true);
    this.imagesService
      .getThumbnailImages()
      .pipe(take(1))
      .subscribe(images => {
        this.images = images;
        this.loaderService.setIsLoading(false);
      });
  }

  public getAdminControlsConfig(image: Image): AdminControlsConfig {
    return {
      buttonSize: 40,
      deleteCb: () => this.onDeleteImage(image),
      itemName: image.id,
    };
  }

  public async onDeleteImage(image: Image): Promise<void> {
    if (!image.id) {
      return;
    }

    const mainImageId = image.id?.slice(0, -8);
    const dialog: Dialog = {
      title: 'Confirm image deletion',
      body: `Delete image [${mainImageId}]?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open({
      componentType: BasicDialogComponent,
      inputs: { dialog },
    });

    if (result === 'confirm') {
      this.store.dispatch(AppActions.deleteImageRequested({ imageId: mainImageId }));
    }
  }

  private generatePlaceholderImages(count: number): Image[] {
    return Array(count).map(() => ({
      articleAppearances: 0,
      dateUploaded: new Date().toISOString(),
      id: uuid.v4(),
      presignedUrl: '',
      size: 0,
    }));
  }
}
