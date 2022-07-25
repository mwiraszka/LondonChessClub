import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { AuthSelectors } from '@app/core/auth';

import * as NavActions from './store/nav.actions';
import * as NavSelectors from './store/nav.selectors';

@Injectable()
export class NavFacade {
  constructor(private readonly store: Store) {}

  user$ = this.store.select(AuthSelectors.user);
  isUserVerified$ = this.store.select(AuthSelectors.isUserVerified);
  isDropdownOpen$ = this.store.select(NavSelectors.isDropdownOpen);

  // WIP: Need to find a good way to 'get member by ID' using their common UUID
  tempFirstName$ = of('Michal');

  onSelectHomeTab(): void {
    this.store.dispatch(NavActions.homeTabSelected());
  }

  onSelectMembersTab(): void {
    this.store.dispatch(NavActions.membersTabSelected());
  }

  onSelectScheduleTab(): void {
    this.store.dispatch(NavActions.scheduleTabSelected());
  }

  onSelectNewsTab(): void {
    this.store.dispatch(NavActions.newsTabSelected());
  }

  onSelectLondonChessChampionTab(): void {
    this.store.dispatch(NavActions.londonChessChampionTabSelected());
  }

  onSelectPhotoGalleryTab(): void {
    this.store.dispatch(NavActions.photoGalleryTabSelected());
  }

  onSelectAboutTab(): void {
    this.store.dispatch(NavActions.aboutTabSelected());
  }

  onSelectLoginTab(): void {
    this.store.dispatch(NavActions.loginTabSelected());
  }

  onToggleDropdown(): void {
    this.store.dispatch(NavActions.dropdownToggled());
  }

  onLogOut(): void {
    this.store.dispatch(NavActions.logOutSelected());
  }

  onResendValidationEmail(): void {
    this.store.dispatch(NavActions.resendVerificationLinkSelected());
  }
}
