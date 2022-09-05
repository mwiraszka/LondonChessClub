import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, of, Subscription } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';

import { AuthActions, AuthSelectors } from '@app/store/auth';
import { NavActions, NavSelectors } from '@app/store/nav';

@Injectable()
export class NavFacade implements OnDestroy {
  user$ = this.store.select(AuthSelectors.user);
  isUserVerified$ = this.store.select(AuthSelectors.isUserVerified);
  isDropdownOpen$ = this.store.select(NavSelectors.isDropdownOpen);
  documentClick$ = fromEvent(document, 'click');

  documentSub: Subscription;

  // TODO: Need to find a good way to 'get member by ID' using their common UUID
  tempFirstName$ = of('Michal');

  constructor(private readonly store: Store) {
    /**
     * Only close the dropdown if it's currently open and the user clicked outside
     * of a part of the dropdown component (i.e. any element with class 'ddcomp')
     */
    this.documentSub = this.documentClick$
      .pipe(
        withLatestFrom(this.isDropdownOpen$),
        filter(
          ([click, isOpen]) =>
            isOpen && !(click.target as HTMLElement).classList.contains('ddcomp')
        )
      )
      .subscribe(() => this.onCloseDropdown());
  }

  onSelectHomeTab(): void {
    this.store.dispatch(NavActions.homeNavigationRequested());
  }

  onSelectMembersTab(): void {
    this.store.dispatch(NavActions.membersNavigationRequested());
  }

  onSelectScheduleTab(): void {
    this.store.dispatch(NavActions.scheduleNavigationRequested());
  }

  onSelectNewsTab(): void {
    this.store.dispatch(NavActions.newsNavigationRequested());
  }

  onSelectLondonChessChampionTab(): void {
    this.store.dispatch(NavActions.londonChessChampionNavigationRequested());
  }

  onSelectPhotoGalleryTab(): void {
    this.store.dispatch(NavActions.photoGalleryNavigationRequested());
  }

  onSelectAboutTab(): void {
    this.store.dispatch(NavActions.aboutNavigationRequested());
  }

  onSelectLoginTab(): void {
    this.store.dispatch(NavActions.loginNavigationRequested());
  }

  onToggleDropdown(): void {
    this.store.dispatch(NavActions.dropdownToggled());
  }

  onCloseDropdown(): void {
    this.store.dispatch(NavActions.dropdownClosed());
  }

  onChangePassword(): void {
    this.store.dispatch(NavActions.changePasswordNavigationRequested());
  }

  onResendVerificationLink(): void {
    this.store.dispatch(AuthActions.resendVerificationLinkRequested());
  }

  onLogOut(): void {
    this.store.dispatch(AuthActions.logoutRequested());
  }

  ngOnDestroy(): void {
    this.documentSub.unsubscribe();
  }
}
