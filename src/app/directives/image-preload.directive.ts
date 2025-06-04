import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { Image } from '@app/models';
import { calculateAspectRatio } from '@app/utils';

/**
 * 1. Provides fallback for broken images (courtesy of Subhan Naeem)
 * 2. Sets aspect ratio to prevent layout shift (when dimensions provided)
 * 3. Respects existing CSS aspect-ratio (doesn't override fixed ratios in grids)
 * 4. Progressive loading with blur-up technique
 */
@Directive({
  selector: 'img[image]',
  host: {
    '(error)': 'onImageError()',
    '(load)': 'onImageLoad()',
    '[src]': 'currentSrc',
    '[alt]': 'image?.caption',
  },
})
export class ImagePreloadDirective implements OnInit, OnChanges {
  readonly FALLBACK_SRC = 'assets/fallback-image.png';

  @Input({ required: true }) image?: Image | null;

  @HostBinding('style.aspect-ratio') aspectRatio?: string;
  @HostBinding('style.transition') transition = 'filter 0.3s ease, opacity 0.3s ease';
  @HostBinding('style.filter') filter = 'none';
  @HostBinding('style.opacity') opacity = '1';
  @HostBinding('style.background') background = 'none';

  public currentSrc?: string | null;

  constructor(private readonly elementRef: ElementRef<HTMLImageElement>) {}

  public ngOnInit(): void {
    this.updateImage();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['image']) {
      this.updateImage();
    }
  }

  protected onImageLoad(): void {
    this.filter = 'none';
    this.opacity = '1';

    if (
      this.currentSrc === this.image?.thumbnailPresignedUrl &&
      this.image?.originalPresignedUrl
    ) {
      const fullImage = new Image();

      fullImage.onload = () => {
        this.currentSrc = this.image!.originalPresignedUrl;
        this.filter = 'none';
        this.opacity = '1';
      };

      fullImage.onerror = () => {
        this.filter = 'none';
        this.opacity = '1';
      };

      fullImage.src = this.image.originalPresignedUrl;
    } else {
      this.filter = 'none';
      this.opacity = '1';
    }
  }

  protected onImageError(): void {
    this.currentSrc = this.image?.originalPresignedUrl ?? this.FALLBACK_SRC;
    this.filter = 'none';
    this.opacity = '1';
  }

  protected updateImage(): void {
    if (!this.image) {
      this.currentSrc = this.FALLBACK_SRC;
      this.opacity = '1';
      return;
    }

    if (this.image?.width && this.image?.height) {
      this.setAspectRatio(this.image.width, this.image.height);
    }

    const { originalPresignedUrl, thumbnailPresignedUrl } = this.image;

    if (originalPresignedUrl) {
      this.currentSrc = originalPresignedUrl;
    } else if (thumbnailPresignedUrl) {
      this.currentSrc = thumbnailPresignedUrl;
      this.filter = 'blur(3px)';
    } else {
      this.currentSrc = this.FALLBACK_SRC;
    }
  }

  private setAspectRatio(width: number, height: number): void {
    const computedStyle = getComputedStyle(this.elementRef.nativeElement);
    const hasFixedAspectRatio = computedStyle.aspectRatio !== 'auto';

    if (!hasFixedAspectRatio) {
      this.aspectRatio = calculateAspectRatio(width, height);
    }

    // Set width and height attributes for better SEO and accessibility
    this.elementRef.nativeElement.setAttribute('width', width.toString());
    this.elementRef.nativeElement.setAttribute('height', height.toString());
  }
}
