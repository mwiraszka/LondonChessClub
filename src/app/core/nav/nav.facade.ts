import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';

import { AuthSelectors } from '@app/core/auth';

import * as NavActions from './store/nav.actions';

@Injectable()
export class NavFacade {
  constructor(private readonly store: Store) {}

  user$ = this.store.select(AuthSelectors.user);

  // WIP: Need to find a good way to 'get member by ID' using their common UUID
  tempFirstName$ = of('Michal*');

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

  onLondonChessChampion(): void {
    this.store.dispatch(NavActions.londonChessChampionSelected());
  }

  onPhotoGallery(): void {
    this.store.dispatch(NavActions.photoGallerySelected());
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
