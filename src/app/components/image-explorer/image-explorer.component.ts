import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import * as uuid from 'uuid';

import { CdkScrollable, CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
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
    CdkScrollableModule,
    CommonModule,
    FormatBytesPipe,
    FormatDatePipe,
    IconsModule,
  ],
  hostDirectives: [CdkScrollable],
})
export class ImageExplorerComponent implements OnInit, DialogOutput<Id> {
  public images$: Observable<Image[]> = of(this.generatePlaceholderImages(25));

  @Output() public dialogResult = new EventEmitter<Id | 'close'>();

  constructor(
    private readonly dialogService: DialogService,
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
      itemName: image.filename,
    };
  }

  public async onDeleteImage(image: Image): Promise<void> {
    if (!image.id) {
      return;
    }

    const mainImageId = image.id?.split('-')[0];
    const dialog: Dialog = {
      title: 'Delete image',
      body: `Delete ${image.filename}?`,
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
      this.store.dispatch(
        ImagesActions.deleteImageRequested({ image: { ...image, id: mainImageId } }),
      );
    }
  }

  private generatePlaceholderImages(count: number): Image[] {
    return Array(count).map(() => ({
      id: uuid.v4(),
      filename: '',
      fileSize: 0,
      articleAppearances: 0,
      dateUploaded: new Date().toISOString(),
      presignedUrl: '',
    }));
  }
}
