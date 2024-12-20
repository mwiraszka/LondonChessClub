import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import { LoaderService } from '@app/services';
import { PhotosActions, PhotosSelectors } from '@app/store/photos';

@Component({
  selector: 'lcc-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  imports: [CommonModule, IconsModule, TooltipDirective],
})
export class ImageViewerComponent {
  public readonly photo$ = this.store.select(PhotosSelectors.selectPhoto);

  @Output() public close = new EventEmitter<void>();

  constructor(
    private loaderService: LoaderService,
    private readonly store: Store,
  ) {}

  public onNextImage(): void {
    this.loaderService.setIsLoading(true);
    this.store.dispatch(PhotosActions.nextPhotoRequested());
  }

  public onPreviousImage(): void {
    this.loaderService.setIsLoading(true);
    this.store.dispatch(PhotosActions.previousPhotoRequested());
  }

  public onImageLoad(): void {
    this.loaderService.setIsLoading(false);
  }

  @HostListener('window:keyup', ['$event'])
  private keyEvent(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.onPreviousImage();
    } else if (event.key === 'ArrowRight' || event.key === 'Space') {
      this.onNextImage();
    }
  }
}
