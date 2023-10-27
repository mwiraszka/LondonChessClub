import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

/**
 * Sanitizes image URLs
 */
@Pipe({ name: 'sanitizeUrl' })
export class SanitizeUrlPipe implements PipeTransform {
  constructor(private sanitize: DomSanitizer) {}

  transform(url: string): SafeUrl {
    return this.sanitize.bypassSecurityTrustUrl(url);
  }
}
