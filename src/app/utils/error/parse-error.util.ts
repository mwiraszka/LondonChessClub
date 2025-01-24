import { isEmpty } from 'lodash';

import { HttpErrorResponse } from '@angular/common/http';

import { LccError } from '@app/models';
import { isString } from '@app/utils/common/is-string.util';

import { isDefined } from '../common/is-defined.util';

/**
 * Convert error to a common LCC Error type.
 */
export function parseError(error: unknown): LccError {
  if (error instanceof HttpErrorResponse) {
    return {
      message: isString(error.error.message)
        ? error.error.message
        : isString(error.message)
          ? error.message
          : 'Unknown HTTP error.',
      status: error.status > 0 ? error.status : undefined,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  if (!isDefined(error) || error === '' || isEmpty(error)) {
    return { message: 'Empty error.' };
  }

  if (isString(error)) {
    return {
      message: error,
    };
  }

  return { message: 'Invalid error.' };
}
