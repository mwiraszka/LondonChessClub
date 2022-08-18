import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, of, Subscription } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';

import { AuthSelectors } from '@app/core/auth';

import * as NavActions from './store/nav.actions';
import * as NavSelectors from './store/nav.selectors';

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

  onCloseDropdown(): void {
    this.store.dispatch(NavActions.dropdownClosed());
  }

  onLogOut(): void {
    this.store.dispatch(NavActions.logOutSelected());
  }

  onResendValidationEmail(): void {
    this.store.dispatch(NavActions.resendVerificationLinkSelected());
  }

  ngOnDestroy(): void {
    this.documentSub.unsubscribe();
  }
}
