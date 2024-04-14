import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Sanitizes image URLs
 */
@Pipe({ name: 'sanitizeUrl' })
export class SanitizeUrlPipe implements PipeTransform {
  ARTICLE_IMAGE_ENDPOINT_URL = 'https://lcc-article-images.s3.us-east-2.amazonaws.com/';

  constructor(private sanitize: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return url.startsWith(this.ARTICLE_IMAGE_ENDPOINT_URL) ||
      url === 'assets/placeholder-image.png'
      ? this.sanitize.bypassSecurityTrustResourceUrl(url)
      : this.sanitize.bypassSecurityTrustResourceUrl('assets/placeholder-image.png');
  }
}
