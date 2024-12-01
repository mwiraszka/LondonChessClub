import removeMd from 'remove-markdown';

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Strips all markdown characters from the text.
 */
@Pipe({
    name: 'stripMarkdown',
    standalone: true
})
export class StripMarkdownPipe implements PipeTransform {
  transform(markdown: string): string {
    return removeMd(markdown)
      .replace(/\|--/g, '')
      .replace(/\|/g, '')
      .replace(/&#39;/g, "'");
  }
}
