import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import IconsModule from '@app/icons';
import type { DialogOutput, Photo } from '@app/types';

import { ImagePreloadDirective } from '../image-preload/image-preload.directive';

@Component({
  selector: 'lcc-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrl: './photo-viewer.component.scss',
  imports: [CommonModule, IconsModule, ImagePreloadDirective, TooltipDirective],
})
export class PhotoViewerComponent implements AfterViewInit, DialogOutput<null> {
  private keyListener?: () => void;

  @Input() index = 0;
  @Input() photos: Photo[] = [];

  @Output() public dialogResult = new EventEmitter<null | 'close'>();

  constructor(private readonly renderer: Renderer2) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.initKeyListener());
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
