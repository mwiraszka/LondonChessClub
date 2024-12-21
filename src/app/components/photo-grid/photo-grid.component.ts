import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Input } from '@angular/core';

import { ImageViewerComponent } from '@app/components/image-viewer/image-viewer.component';
import { OverlayService } from '@app/services';
import { PhotosActions, PhotosSelectors } from '@app/store/photos';
import { Photo } from '@app/types';

@Component({
  selector: 'lcc-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrls: ['./photo-grid.component.scss'],
  imports: [CommonModule],
})
export class PhotoGridComponent {
  @Input() public maxPhotos?: number;

  public readonly photos$ = this.store.select(PhotosSelectors.selectPhotos);

  private imageViewerRef: ComponentRef<ImageViewerComponent> | null = null;

  constructor(
    private readonly overlayService: OverlayService<ImageViewerComponent>,
    private readonly store: Store,
  ) {}

  public onClickPhoto(photo: Photo): void {
    this.store.dispatch(PhotosActions.photoSelected({ photo }));
    this.imageViewerRef = this.overlayService.open(ImageViewerComponent);
    this.imageViewerRef.instance.close
      .pipe(first())
      .subscribe(() => this.overlayService.close());
  }
}
