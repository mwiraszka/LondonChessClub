import { Observable } from 'rxjs';

import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';

import { environment } from '@env';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (!environment.production) {
    console.info('Request', req.url);
  }
  return next(req);
}
