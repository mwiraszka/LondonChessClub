import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import * as uuid from 'uuid';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AdminControlsDirective } from '@app/components/admin-controls/admin-controls.directive';
import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import IconsModule from '@app/icons';
import type {
  AdminControlsConfig,
  BasicDialogResult,
  Dialog,
  DialogOutput,
  Id,
  Image,
} from '@app/models';
import { FormatBytesPipe, FormatDatePipe } from '@app/pipes';
import { DialogService } from '@app/services';
import * as ImagesActions from '@app/store/images/images.actions';
import * as ImagesSelectors from '@app/store/images/images.selectors';

@UntilDestroy()
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
  public images$: Observable<Image[]> = of(this.generatePlaceholderImages(25));

  @Output() public dialogResult = new EventEmitter<Id | 'close'>();

  constructor(
    private readonly dialogService: DialogService<
      BasicDialogComponent,
      BasicDialogResult
    >,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(ImagesActions.fetchArticleBannerImageThumbnailsRequested());
    this.images$ = this.store
      .select(ImagesSelectors.selectThumbnailImages)
      .pipe(untilDestroyed(this));
  }

  public getAdminControlsConfig(image: Image): AdminControlsConfig {
    return {
      buttonSize: 34,
      deleteCb: () => this.onDeleteImage(image),
      itemName: image.id?.slice(0, -8),
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
      this.store.dispatch(
        ImagesActions.deleteImageRequested({ image: { ...image, id: mainImageId } }),
      );
    }
  }

  private generatePlaceholderImages(count: number): Image[] {
    return Array(count).map(() => ({
      articleAppearances: 0,
      dateUploaded: new Date().toISOString(),
      id: uuid.v4(),
      presignedUrl: '',
      fileSize: 0,
    }));
  }
}
