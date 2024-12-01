import { Pipe, PipeTransform } from '@angular/core';

/**
 * Produces an array of numbers, useful for basic loops in template
 */
@Pipe({
    name: 'range',
    standalone: true
})
export class RangePipe implements PipeTransform {
  transform(length: number, offset = 0): number[] {
    if (!length) {
      return [];
    }

    const array = [];
    for (let i = 0; i < length; i++) {
      array.push(offset + i);
    }
    return array;
  }
}
