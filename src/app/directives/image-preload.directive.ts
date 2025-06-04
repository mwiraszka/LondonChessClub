import { Directive, HostBinding, Input, OnInit, ElementRef } from '@angular/core';
import { calculateAspectRatio } from '../utils';

/**
 * Enhanced image directive that:
 * 1. Provides fallback for broken images (courtesy of Subhan Naeem)
 * 2. Sets aspect ratio to prevent layout shift (when dimensions provided)
 * 3. Adds loaded class for styling
 * 4. Respects existing CSS aspect-ratio (doesn't override fixed ratios in grids)
 */
@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    '(load)': 'load()',
    '[src]': 'src',
  },
})
export class ImagePreloadDirective implements OnInit {
  @Input() src?: string | null;
  @Input() default?: string;
  @Input() width?: number;
  @Input() height?: number;
  @Input() preserveNaturalRatio: boolean = false;

  @HostBinding('class') className?: string;
  @HostBinding('style.aspect-ratio') aspectRatio?: string;

  constructor(private readonly elementRef: ElementRef<HTMLImageElement>) {}

  public ngOnInit(): void {
    this.setAspectRatio();
  }

  public updateUrl(): void {
    this.src = this.default;
  }

  public load(): void {
    this.className = 'lcc-image-loaded';
  }

  private setAspectRatio(): void {
    // Only set aspect ratio if:
    // 1. We have width and height
    // 2. preserveNaturalRatio is true
    // 3. The element doesn't already have a fixed aspect-ratio in CSS
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
