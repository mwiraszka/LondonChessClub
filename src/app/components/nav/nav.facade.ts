import { Store } from '@ngrx/store';
import { Subscription, fromEvent } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';

import { Injectable, OnDestroy, OnInit } from '@angular/core';

import { AuthActions, AuthSelectors } from '@app/store/auth';
import { NavActions, NavSelectors } from '@app/store/nav';

@Injectable()
export class NavFacade implements OnInit, OnDestroy {
  user$ = this.store.select(AuthSelectors.user);
  isUserVerified$ = this.store.select(AuthSelectors.isUserVerified);
  isDropdownOpen$ = this.store.select(NavSelectors.isDropdownOpen);
  documentClick$ = fromEvent(document, 'click');

  documentSub!: Subscription;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    /**
     * Only close the dropdown if it's currently open and the user clicked outside
     * of a part of the dropdown component (i.e. any element with class 'ddcomp')
     */
    this.documentSub = this.documentClick$
      .pipe(
        withLatestFrom(this.isDropdownOpen$),
        filter(
          ([click, isOpen]) =>
            isOpen && !(click.target as HTMLElement).classList.contains('ddcomp'),
        ),
      )
      .subscribe(() => this.onCloseDropdown());
  }

  ngOnDestroy(): void {
    this.documentSub.unsubscribe();
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

  onSelectCityChampionTab(): void {
    this.store.dispatch(NavActions.cityChampionNavigationRequested());
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

  onLogOut(): void {
    this.store.dispatch(AuthActions.logoutRequested());
  }
}
