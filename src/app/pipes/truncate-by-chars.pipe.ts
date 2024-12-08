import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncates text down to the number of characters provided.
 * With ellipsis added (default), text will truncate by an additional 3 characters.
 */
@Pipe({
  name: 'truncateByChars',
})
export class TruncateByCharsPipe implements PipeTransform {
  transform(
    text: string | undefined,
    characterLimit: number,
    addEllipsis = true,
  ): string {
    if (!text) {
      return '';
    }

    if (text.length < characterLimit) {
      return text;
    }

    return addEllipsis
      ? text.slice(0, characterLimit - 3) + '...'
      : text.slice(0, characterLimit);
  }
}
