import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Courtesy of Subhan Naeem:
 * https://medium.com/@sub.metu/angular-fallback-for-broken-images-5cd05c470f08
 */
@Directive({
  standalone: true,
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    '(load)': 'load()',
    '[src]': 'src',
  },
})
export class ImagePreloadDirective {
  @Input() src?: string | null;
  @Input() default?: string;

  @HostBinding('class') className?: string;

  updateUrl(): void {
    this.src = this.default;
  }

  load(): void {
    this.className = 'lcc-image-loaded';
  }
}
