import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, take } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { CdkScrollable, CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { AdminToolbarComponent } from '@app/components/admin-toolbar/admin-toolbar.component';
import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { DataToolbarComponent } from '@app/components/data-toolbar/data-toolbar.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import {
  AdminControlsConfig,
  BasicDialogResult,
  DataPaginationOptions,
  Dialog,
  DialogOutput,
  Id,
  Image,
  InternalLink,
} from '@app/models';
import { FormatBytesPipe, FormatDatePipe, HighlightPipe } from '@app/pipes';
import { DialogService } from '@app/services';
import * as ImagesActions from '@app/store/images/images.actions';
import * as ImagesSelectors from '@app/store/images/images.selectors';
import { isSecondsInPast } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-image-explorer',
  templateUrl: './image-explorer.component.html',
  styleUrl: './image-explorer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AdminControlsDirective,
    AdminToolbarComponent,
    CdkScrollableModule,
    CommonModule,
    DataToolbarComponent,
    FormatBytesPipe,
    FormatDatePipe,
    HighlightPipe,
    ImagePreloadDirective,
  ],
  hostDirectives: [CdkScrollable],
})
export class ImageExplorerComponent implements OnInit, DialogOutput<Id> {
  @Input() public selectable: boolean = true;

  @Output() public dialogResult = new EventEmitter<Id | 'close'>();

  public viewModel$?: Observable<{
    images: Image[];
    filteredCount: number;
    options: DataPaginationOptions<Image>;
    totalCount: number;
  }>;

  public readonly addImageLink: InternalLink = {
    internalPath: ['image', 'add'],
    text: 'Add an image',
    icon: 'add_circle_outline',
  };

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    // Set up the view model first
    this.viewModel$ = combineLatest([
      this.store.select(ImagesSelectors.selectAllImages),
      this.store.select(ImagesSelectors.selectFilteredCount),
      this.store.select(ImagesSelectors.selectOptions),
      this.store.select(ImagesSelectors.selectTotalCount),
    ]).pipe(
      untilDestroyed(this),
      map(([images, filteredCount, options, totalCount]) => ({
        images,
        filteredCount,
        options,
        totalCount,
      })),
      shareReplay(1),
    );

    // Dispatch action after a microtask to avoid change detection issues
    Promise.resolve().then(() => {
      this.store
        .select(ImagesSelectors.selectLastThumbnailsFetch)
        .pipe(take(1))
        .subscribe(lastFetch => {
          if (!lastFetch || isSecondsInPast(lastFetch, 600)) {
            this.store.dispatch(ImagesActions.fetchThumbnailsRequested());
          }
        });
    });
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
      title: 'Confirm',
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

  public onOptionsChange(options: DataPaginationOptions<Image>, fetch = true): void {
    this.store.dispatch(ImagesActions.paginationOptionsChanged({ options, fetch }));
  }
}
