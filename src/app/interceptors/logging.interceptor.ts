import { Observable } from 'rxjs';

import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  console.info('Request', req.url);
  return next(req);
}
