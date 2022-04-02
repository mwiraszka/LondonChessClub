import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncates text down to the number of characters provided.
 * With ellipsis added, text will truncate by an additional 3 characters.
 */
@Pipe({ name: 'truncateByChars' })
export class TruncateByCharsPipe implements PipeTransform {
  transform(text: string, characterLimit: number, addEllipsis?: boolean): string {
    return text.length < characterLimit
      ? text
      : addEllipsis
      ? text.slice(0, characterLimit - 3) + '...'
      : text.slice(0, characterLimit);
  }
}
