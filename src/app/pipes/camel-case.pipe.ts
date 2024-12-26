import { camelCase } from 'lodash';

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Convert string to camel-case; return `''` if invalid string provided.
 */
@Pipe({
  name: 'camelCase',
})
export class CamelCasePipe implements PipeTransform {
  transform(value: unknown): string {
    return typeof value === 'string' ? camelCase(value) : '';
  }
}
