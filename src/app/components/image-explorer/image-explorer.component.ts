import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CdkScrollable, CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
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
    ImagePreloadDirective,
  ],
  hostDirectives: [CdkScrollable],
})
export class ImageExplorerComponent implements OnInit, DialogOutput<Id> {
  @Input() public selectable: boolean = true;

  @Output() public dialogResult = new EventEmitter<Id | 'close'>();

  public images$?: Observable<Image[]>;

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(ImagesActions.fetchImageThumbnailsRequested());
    this.images$ = this.store
      .select(ImagesSelectors.selectAllImages)
      .pipe(untilDestroyed(this));
  }

  public getAdminControlsConfig(image: Image): AdminControlsConfig {
    return {
      buttonSize: 34,
      deleteCb: () => this.onDeleteImage(image),
      editPath: ['image', 'edit', image.id.split('-')[0]],
      editInNewTab: true,
      isDeleteDisabled: !!image?.articleAppearances,
      deleteDisabledReason: 'Image cannot be delete while it is used in an article',
      itemName: image.filename,
    };
  }

  public async onDeleteImage(image: Image): Promise<void> {
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
      this.store.dispatch(ImagesActions.deleteImageRequested({ image }));
    }
  }
}
