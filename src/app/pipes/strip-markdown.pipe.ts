import removeMd from 'remove-markdown';

import { Pipe, PipeTransform } from '@angular/core';

/**
 * An Angular pipe wrapper for the removeMd function from 'remove-markdown',
 * stripping all markdown characters from the text.
 */
@Pipe({ name: 'stripMarkdown' })
export class StripMarkdownPipe implements PipeTransform {
  transform(markdown: string): string {
    return removeMd(markdown);
  }
}
