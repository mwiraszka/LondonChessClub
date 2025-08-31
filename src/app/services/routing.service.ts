import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private _fragmentSubject = new BehaviorSubject<string | null>(null);

  public readonly fragment$: Observable<string | null> =
    this._fragmentSubject.asObservable();

  constructor(
    private readonly dialogService: DialogService,
    private readonly router: Router,
  ) {
    const fragment = this.router.parseUrl(this.router.url).fragment;
    this._fragmentSubject.next(fragment);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const fragment = this.router.parseUrl(this.router.url).fragment;
        this._fragmentSubject.next(fragment);
        this.dialogService.closeAll();
      });
  }

  public removeFragment(): void {
    if (!this._fragmentSubject.getValue()) {
      return;
    }

    this.router.navigate([], {
      fragment: undefined,
      queryParamsHandling: 'preserve',
      replaceUrl: true,
    });

    this._fragmentSubject.next(null);
  }
}
