import { HttpErrorResponse } from '@angular/common/http';

/**
 * Convert 0-status errors to standard 500-status server errors; otherwise return unchanged.
 *
 * @param {HttpErrorResponse} response
 */
export function parseHttpErrorResponse(response: HttpErrorResponse): HttpErrorResponse {
  if (response.status !== 0) {
    return response;
  }

  return {
    ...response,
    status: 500,
    error: 'Unknown server error.',
  };
}
