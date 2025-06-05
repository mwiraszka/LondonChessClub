import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
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

  private skeletonElement?: HTMLElement;

  constructor(
    private readonly elementRef: ElementRef<HTMLImageElement>,
    private readonly renderer: Renderer2,
  ) {}

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
    this.removeShimmerEffect();

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
    // Don't override skeleton element if we're intentionally showing the shimmer
    if (this.skeletonElement) {
      return;
    }

    this.removeShimmerEffect();
    this.currentSrc = this.image?.originalPresignedUrl ?? this.FALLBACK_SRC;
    this.filter = 'none';
    this.opacity = '1';
  }

  protected updateImage(): void {
    if (!this.image) {
      this.removeShimmerEffect();
      this.currentSrc = this.FALLBACK_SRC;
      this.opacity = '1';
      return;
    }

    if (this.image?.width && this.image?.height) {
      this.setAspectRatio(this.image.width, this.image.height);
    }

    const { originalPresignedUrl, thumbnailPresignedUrl } = this.image;

    if (originalPresignedUrl) {
      this.removeShimmerEffect();
      this.currentSrc = originalPresignedUrl;
    } else if (thumbnailPresignedUrl) {
      this.removeShimmerEffect();
      this.currentSrc = thumbnailPresignedUrl;
      this.filter = 'blur(3px)';
    } else {
      // No URLs available - show shimmer effect while waiting for presigned URLs
      this.displayShimmerEffect();
    }
  }

  private displayShimmerEffect(): void {
    // Clean up any existing shimmer first
    this.removeShimmerEffect();

    this.background = 'var(--lcc-color--contentPlaceholder-background)';
    // Remove src attribute and hide img element completely
    this.renderer.removeAttribute(this.elementRef.nativeElement, 'src');
    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
    this.currentSrc = null;

    const shimmer = this.renderer.createElement('div');
    this.renderer.addClass(shimmer, 'lcc-content-placeholder');
    this.renderer.setStyle(shimmer, 'position', 'absolute');
    this.renderer.setStyle(shimmer, 'top', '0');
    this.renderer.setStyle(shimmer, 'left', '0');
    this.renderer.setStyle(shimmer, 'width', '100%');
    this.renderer.setStyle(shimmer, 'height', '100%');
    this.renderer.setStyle(shimmer, 'pointer-events', 'none');

    const parentElement = this.elementRef.nativeElement.parentElement;
    if (parentElement) {
      this.renderer.setStyle(parentElement, 'position', 'relative');
      this.renderer.appendChild(parentElement, shimmer);
    }
    this.skeletonElement = shimmer;
  }

  private removeShimmerEffect(): void {
    if (!this.skeletonElement) {
      return;
    }

    const parentElement = this.elementRef.nativeElement.parentElement;
    if (parentElement && parentElement.contains(this.skeletonElement)) {
      this.renderer.removeChild(parentElement, this.skeletonElement);
    }

    // Restore image element visibility
    this.renderer.removeStyle(this.elementRef.nativeElement, 'display');

    this.skeletonElement = undefined;
    this.background = '';
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
