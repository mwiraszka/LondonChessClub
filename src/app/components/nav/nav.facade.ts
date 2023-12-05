import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { AuthActions, AuthSelectors } from '@app/store/auth';
import { ImageOverlaySelectors } from '@app/store/image-overlay';
import { NavActions } from '@app/store/nav';

@Injectable()
export class NavFacade {
  user$ = this.store.select(AuthSelectors.user);
  isUserVerified$ = this.store.select(AuthSelectors.isUserVerified);
  isOverlayOpen$ = this.store.select(ImageOverlaySelectors.isOpen);

  constructor(private readonly store: Store) {}

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

  onChangePassword(): void {
    this.store.dispatch(NavActions.changePasswordNavigationRequested());
  }

  onLogOut(): void {
    this.store.dispatch(AuthActions.logoutRequested());
  }
}
