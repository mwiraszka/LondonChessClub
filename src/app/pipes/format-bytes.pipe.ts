import { Pipe, PipeTransform } from '@angular/core';

import { formatBytes } from '@app/utils';

/**
 * Converts a raw number of Bytes to a more user-friendly size in KB/MB units
 */
@Pipe({
  name: 'formatBytes',
})
export class FormatBytesPipe implements PipeTransform {
  transform(input?: string | number | null, decimals = 2): string {
    return formatBytes(input, decimals);
  }
}
