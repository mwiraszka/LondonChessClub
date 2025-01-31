import { Observable } from 'rxjs';

import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function addHeaderInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const clonedRequest = req.clone({ withCredentials: true });
  return next(clonedRequest);
}
