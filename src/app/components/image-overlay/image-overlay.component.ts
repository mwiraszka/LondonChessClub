import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

import { LoaderService } from '@app/services';

import { ImageOverlayFacade } from './image-overlay.facade';

@Component({
  selector: 'lcc-image-overlay',
  templateUrl: './image-overlay.component.html',
  styleUrls: ['./image-overlay.component.scss'],
  providers: [ImageOverlayFacade],
})
export class ImageOverlayComponent implements OnInit, OnDestroy {
  imageHeight!: number | null;

  constructor(
    public facade: ImageOverlayFacade,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
  ) {}

  ngOnInit(): void {
    this.loaderService.display(true);
    this.renderer.addClass(this._document.body, 'lcc-disable-scrolling');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this._document.body, 'lcc-disable-scrolling');
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.calculateImageHeight();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowLeft') {
      this.loaderService.display(true);
      this.facade.onPreviousImage();
    } else if (event.key == 'ArrowRight') {
      this.loaderService.display(true);
      this.facade.onNextImage();
    } else if (event.key == 'Escape') {
      this.facade.onClose();
    }
  }

  imageLoaded(): void {
    this.calculateImageHeight();
    this.loaderService.display(false);
  }

  calculateImageHeight(): void {
    const image = this._document.getElementById('overlayImage');
    this.imageHeight = image?.clientHeight ?? null;
  }
}
