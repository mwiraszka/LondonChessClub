import { Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

import { calculateAspectRatio } from '../utils';

/**
 * 1. Provides fallback for broken images (courtesy of Subhan Naeem)
 * 2. Sets aspect ratio to prevent layout shift (when dimensions provided)
 * 3. Respects existing CSS aspect-ratio (doesn't override fixed ratios in grids)
 */
@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src',
  },
})
export class ImagePreloadDirective implements OnInit {
  @Input() src?: string | null;
  @Input() default?: string;
  @Input() width?: number;
  @Input() height?: number;
  @Input() preserveNaturalRatio: boolean = false;

  @HostBinding('style.aspect-ratio') aspectRatio?: string;

  constructor(private readonly elementRef: ElementRef<HTMLImageElement>) {}

  public ngOnInit(): void {
    this.setAspectRatio();
  }

  public updateUrl(): void {
    this.src = this.default;
  }

  private setAspectRatio(): void {
    if (this.width && this.height && this.preserveNaturalRatio) {
      const computedStyle = getComputedStyle(this.elementRef.nativeElement);
      const hasFixedAspectRatio = computedStyle.aspectRatio !== 'auto';

      if (!hasFixedAspectRatio) {
        this.aspectRatio = calculateAspectRatio(this.width, this.height);
      }

      // Always set width and height attributes for better SEO and accessibility
      this.elementRef.nativeElement.setAttribute('width', this.width.toString());
      this.elementRef.nativeElement.setAttribute('height', this.height.toString());
    }
  }
}
