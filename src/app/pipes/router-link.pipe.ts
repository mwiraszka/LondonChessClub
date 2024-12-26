import { Pipe, PipeTransform } from '@angular/core';

import type { InternalPath } from '@app/types';

/**
 * Parse potential InternalPath tuple and add '/' prefix for Angular's routerLink.
 */
@Pipe({
  name: 'routerLink',
})
export class RouterLinkPipe implements PipeTransform {
  transform(path: InternalPath | string): string {
    const fullPath = Array.isArray(path) ? path.join('/') : path;
    return '/' + fullPath;
  }
}
