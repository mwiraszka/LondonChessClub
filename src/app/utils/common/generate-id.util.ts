import { Id } from '@app/types';

import { isDefined } from './is-defined.util';

export function generateId(length?: number): Id {
  length = isDefined(length) && length > 0 && length <= 100 ? length : 24;

  return Array.from({ length }, () => Math.floor(Math.random() * 16))
    .map(i => '0123456789abcdef'.charAt(i))
    .join('');
}
