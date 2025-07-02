import { BehaviorSubject, Observable, filter } from 'rxjs';

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RouteFragmentService {
  private _fragmentSubject = new BehaviorSubject<string | null>(null);

  public readonly fragment$: Observable<string | null> =
    this._fragmentSubject.asObservable();

  constructor(private router: Router) {
    const fragment = this.router.parseUrl(this.router.url).fragment;
    this._fragmentSubject.next(fragment);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const fragment = this.router.parseUrl(this.router.url).fragment;
        this._fragmentSubject.next(fragment);
      });
  }
}
