import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { PhotoGridComponent } from '@app/components/photo-grid/photo-grid.component';
import { Id, Image, IsoDate } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { ImagesActions, ImagesSelectors } from '@app/store/images';
import { isExpired } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-photo-gallery-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        title="Photo Gallery"
        icon="photo_camera">
      </lcc-page-header>

      <lcc-photo-grid
        [isAdmin]="vm.isAdmin"
        [lastAlbumCoversFetch]="vm.lastAlbumCoversFetch"
        [lastImageMetadataFetch]="vm.lastImageMetadataFetch"
        [photoImages]="vm.photoImages"
        (requestDeleteAlbum)="onRequestDeleteAlbum($event)"
        (requestFetchThumbnails)="onRequestFetchThumbnails($event)">
      </lcc-photo-grid>
    }
  `,
  imports: [CommonModule, PageHeaderComponent, PhotoGridComponent],
})
export class PhotoGalleryPageComponent implements OnInit {
  public viewModel$?: Observable<{
    isAdmin: boolean;
    lastAlbumCoversFetch: IsoDate | null;
    lastImageMetadataFetch: IsoDate | null;
    photoImages: Image[];
  }>;

  constructor(
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Photo Gallery');
    this.metaAndTitleService.updateDescription(
      'Browse through photos of our club events over the years.',
    );

    this.store
      .select(ImagesSelectors.selectLastMetadataFetch)
      .pipe(take(1))
      .subscribe(lastMetadataFetch => {
        if (!lastMetadataFetch || isExpired(lastMetadataFetch)) {
          this.store.dispatch(ImagesActions.fetchAllImagesMetadataRequested());
        }
      });

    this.viewModel$ = combineLatest([
      this.store.select(AuthSelectors.selectIsAdmin),
      this.store.select(ImagesSelectors.selectLastAlbumCoversFetch),
      this.store.select(ImagesSelectors.selectLastMetadataFetch),
      this.store.select(ImagesSelectors.selectPhotoImages),
    ]).pipe(
      untilDestroyed(this),
      map(([isAdmin, lastAlbumCoversFetch, lastImageMetadataFetch, photoImages]) => ({
        isAdmin,
        lastAlbumCoversFetch,
        lastImageMetadataFetch,
        photoImages,
      })),
    );
  }

  public onRequestDeleteAlbum(album: string): void {
    this.store.dispatch(ImagesActions.deleteAlbumRequested({ album }));
  }

  public onRequestFetchThumbnails(imageIds: Id[]): void {
    this.store.dispatch(
      ImagesActions.fetchBatchThumbnailsRequested({
        imageIds,
        context: 'album-covers',
      }),
    );
  }
}
