import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { AuthSelectors } from '@app/store/auth';
import { UserSettingsActions, UserSettingsSelectors } from '@app/store/user-settings';

@Injectable()
export class NavFacade {
  readonly isDarkMode$ = this.store.select(UserSettingsSelectors.isDarkMode);
  readonly isSafeMode$ = this.store.select(UserSettingsSelectors.isSafeMode);
  readonly user$ = this.store.select(AuthSelectors.user);

  constructor(private readonly store: Store) {}

  onToggleTheme(): void {
    this.store.dispatch(UserSettingsActions.toggleTheme());
  }

  onToggleSafeMode(): void {
    this.store.dispatch(UserSettingsActions.toggleSafeMode());
  }
}
