import { HttpErrorResponse } from '@angular/common/http';

import { parseHttpErrorResponse } from './parse-http-error-response.util';

describe('parseHttpErrorResponse', () => {
  it('converts status-0 errors correctly', () => {
    const response = new HttpErrorResponse({
      status: 0,
    });

    expect(parseHttpErrorResponse(response)).toStrictEqual({
      status: 500,
      message: 'Unknown server error.',
    });
  });

  it('converts other errors correctly', () => {
    const response = new HttpErrorResponse({
      status: 400,
      error: 'error message',
      statusText: 'some value',
      url: 'some value',
    });

    expect(parseHttpErrorResponse(response)).toStrictEqual({
      status: 400,
      message: 'error message',
    });
  });
});
