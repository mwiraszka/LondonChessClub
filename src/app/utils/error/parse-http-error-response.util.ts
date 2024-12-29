import { HttpErrorResponse } from '@angular/common/http';

import { LccError } from '@app/types';

/**
 * Simplify HttpErrorResponse types and convert 0-status errors to standard 500-status errors.
 */
export function parseHttpErrorResponse(response: HttpErrorResponse): LccError {
  if (response.status === 0) {
    return {
      status: 500,
      message: 'Unknown server error.',
    };
  }

  return {
    status: response.status,
    message: response.error,
  };
}
