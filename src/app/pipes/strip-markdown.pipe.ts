import removeMd from 'remove-markdown';

import { Pipe, PipeTransform } from '@angular/core';

import { isDefined } from '@app/utils';

/**
 * Strip all markdown characters from the text.
 */
@Pipe({
  name: 'stripMarkdown',
})
export class StripMarkdownPipe implements PipeTransform {
  transform(markdown?: string): string {
    if (!isDefined(markdown)) {
      return '';
    }

    return removeMd(markdown)
      .replace(/\|--/g, '')
      .replace(/\|/g, '')
      .replace(/&#39;/g, "'");
  }
}
