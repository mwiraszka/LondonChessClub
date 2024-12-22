import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import { DialogControls, Photo } from '@app/types';

import { ImagePreloadDirective } from '../image-preload/image-preload.directive';

@Component({
  selector: 'lcc-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss'],
  imports: [CommonModule, IconsModule, ImagePreloadDirective, TooltipDirective],
})
export class PhotoViewerComponent implements OnInit, DialogControls {
  @ViewChild('photo') imageElementRef?: ElementRef;

  private keyListener?: () => void;

  @Input() index = 0;
  @Input() photos: Photo[] = [];

  // Dialog controls
  @Output() public close = new EventEmitter<void>();
  @Output() public confirm = new EventEmitter<string>();

  constructor(private readonly renderer: Renderer2) {}

  ngOnInit(): void {
    this.initKeyListener();
  }

  ngOnDestroy(): void {
    this.keyListener?.();
  }

  public onPreviousPhoto(): void {
    this.index = this.index > 0 ? this.index - 1 : this.photos.length - 1;
  }

  public onNextPhoto(): void {
    this.index = this.index < this.photos.length - 1 ? this.index + 1 : 0;
  }

  public onPhotoLoad(): void {
    const imageElement = this.imageElementRef?.nativeElement;

    if (imageElement.clientHeight > imageElement.clientWidth) {
      this.renderer.addClass(imageElement, 'portrait-mode');
    } else {
      this.renderer.removeClass(imageElement, 'portrait-mode');
    }
  }

  private initKeyListener(): void {
    this.keyListener = this.renderer.listen(
      'document',
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
          this.onPreviousPhoto();
        } else if (event.key === 'ArrowRight' || event.key === ' ') {
          this.onNextPhoto();
        }
      },
    );
  }
}
