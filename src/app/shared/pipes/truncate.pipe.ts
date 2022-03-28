import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(text: string, characterLimit: number, addEllipsis?: boolean): string {
    return text.length < characterLimit
      ? text
      : addEllipsis
      ? text.slice(0, characterLimit - 3) + '...'
      : text.slice(0, characterLimit);
  }
}
