import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import { LoaderService } from '@app/services';

import { ImageOverlayFacade } from './image-overlay.facade';

@Component({
  selector: 'lcc-image-overlay',
  templateUrl: './image-overlay.component.html',
  styleUrls: ['./image-overlay.component.scss'],
  providers: [ImageOverlayFacade],
  imports: [CommonModule, IconsModule, TooltipDirective],
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
    this.loaderService.setIsLoading(true);
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
    if (event.key === 'ArrowLeft') {
      this.onPreviousImage();
    } else if (event.key === 'ArrowRight' || event.key === 'Space') {
      this.onNextImage();
    } else if (event.key === 'Escape') {
      this.facade.onClose();
    }
  }

  onNextImage(): void {
    this.loaderService.setIsLoading(true);
    this.facade.onNextImage();
  }

  onPreviousImage(): void {
    this.loaderService.setIsLoading(true);
    this.facade.onPreviousImage();
  }

  imageLoaded(): void {
    this.calculateImageHeight();
    this.loaderService.setIsLoading(false);
  }

  calculateImageHeight(): void {
    const image = this._document.getElementById('overlay-image');
    this.imageHeight = image?.clientHeight ?? null;
  }
}
