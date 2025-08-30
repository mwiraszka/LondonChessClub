import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { NavSelectors } from '@app/store/nav';

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
    private readonly store: Store,
  ) {
    const fragment = this.router.parseUrl(this.router.url).fragment;
    this._fragmentSubject.next(fragment);

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        switchMap(() => this.store.select(NavSelectors.selectIsNewPage)),
      )
      .subscribe(isNewPage => {
        const fragment = this.router.parseUrl(this.router.url).fragment;
        this._fragmentSubject.next(fragment);

        if (isNewPage) {
          this.dialogService.closeAll();
        }
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
