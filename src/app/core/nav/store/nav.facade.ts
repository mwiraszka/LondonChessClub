import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthSelectors } from '@app/core/auth';
import { User } from '@app/shared/types';

import * as NavActions from './nav.actions';

@Injectable()
export class NavFacade {
  constructor(private readonly store: Store) {}

  user$: Observable<User | null> = this.store.select(AuthSelectors.user);

  private _isUserDropdownOpen$ = new BehaviorSubject<boolean>(true);
  isUserDropdownOpen$ = this._isUserDropdownOpen$.asObservable();

  onHome(): void {
    this.store.dispatch(NavActions.homeSelected());
  }

  onMembers(): void {
    this.store.dispatch(NavActions.membersSelected());
  }

  onSchedule(): void {
    this.store.dispatch(NavActions.scheduleSelected());
  }

  onNews(): void {
    this.store.dispatch(NavActions.newsSelected());
  }

  onCityChampion(): void {
    this.store.dispatch(NavActions.cityChampionSelected());
  }

  onLessons(): void {
    this.store.dispatch(NavActions.lessonsSelected());
  }

  onSupplies(): void {
    this.store.dispatch(NavActions.suppliesSelected());
  }

  onAbout(): void {
    this.store.dispatch(NavActions.aboutSelected());
  }

  onLogin(): void {
    this.store.dispatch(NavActions.loginSelected());
  }

  onLogout(): void {
    this.store.dispatch(NavActions.logoutSelected());
  }

  onToggleUserDropdown(): void {
    this._isUserDropdownOpen$.next(!this.isUserDropdownOpen$);
  }
}
