import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';

import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import IconsModule from '@app/icons';
import type { DialogOutput, Image } from '@app/models';

@Component({
  selector: 'lcc-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
  imports: [CommonModule, IconsModule, ImagePreloadDirective, TooltipDirective],
})
export class ImageViewerComponent implements AfterViewInit, DialogOutput<null> {
  private keyListener?: () => void;

  @Input() index = 0;
  @Input() images: Image[] = [];

  @Output() public dialogResult = new EventEmitter<null | 'close'>();

  constructor(private readonly renderer: Renderer2) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.initKeyListener());
  }

  ngOnDestroy(): void {
    this.keyListener?.();
  }

  public onPreviousImage(): void {
    this.index = this.index > 0 ? this.index - 1 : this.images.length - 1;
  }

  public onNextImage(): void {
    this.index = this.index < this.images.length - 1 ? this.index + 1 : 0;
  }

  private initKeyListener(): void {
    this.keyListener = this.renderer.listen(
      'document',
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
          this.onPreviousImage();
        } else if (event.key === 'ArrowRight' || event.key === ' ') {
          this.onNextImage();
        }
      },
    );
  }
}
