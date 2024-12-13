import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts a raw number of Bytes to a more user-friendly size in KB/MB units
 */
@Pipe({
  name: 'formatBytes',
})
export class FormatBytesPipe implements PipeTransform {
  transform(input?: string | number | null, decimals = 2): string {
    const bytes = Number(input);

    if (isNaN(bytes)) {
      return '0 B';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'kB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
}
