import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import { DialogOutput, Photo } from '@app/types';

import { ImagePreloadDirective } from '../image-preload/image-preload.directive';

@Component({
  selector: 'lcc-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrl: './photo-viewer.component.scss',
  imports: [CommonModule, IconsModule, ImagePreloadDirective, TooltipDirective],
})
export class PhotoViewerComponent implements AfterViewInit, DialogOutput<null> {
  @ViewChild('navigationButtonsContainer')
  navigationButtonsContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('previousPhotoButton') previousPhotoButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('nextPhotoButton') nextPhotoButton?: ElementRef<HTMLButtonElement>;

  private clickListener?: () => void;
  private keyListener?: () => void;

  @Input() index = 0;
  @Input() photos: Photo[] = [];

  @Output() public dialogResult = new EventEmitter<null | 'close'>();

  constructor(private readonly renderer: Renderer2) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.initEventListeners());
  }

  ngOnDestroy(): void {
    this.clickListener?.();
    this.keyListener?.();
  }

  public onPreviousPhoto(): void {
    this.index = this.index > 0 ? this.index - 1 : this.photos.length - 1;
  }

  public onNextPhoto(): void {
    this.index = this.index < this.photos.length - 1 ? this.index + 1 : 0;
  }

  private initEventListeners(): void {
    this.clickListener = this.renderer.listen(
      this.navigationButtonsContainer?.nativeElement,
      'click',
      (event: MouseEvent) => {
        if (
          event.target instanceof Node &&
          !this.previousPhotoButton?.nativeElement.contains(event.target) &&
          !this.nextPhotoButton?.nativeElement.contains(event.target)
        ) {
          // Due to absolute positioning on navigation buttons, default backdrop event listener in
          // dialog service is overridden, and unable to easily gain access to DOM elements behind
          // the buttons overlay to set up new click listeners. So instead, this is set up to close
          // when anything but the previous and next buttons (and for reason the label) are clicked
          this.dialogResult.emit('close');
        }
      },
    );

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
