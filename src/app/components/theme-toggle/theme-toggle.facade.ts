import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { UserSettingsActions, UserSettingsSelectors } from '@app/store/user-settings';

@Injectable()
export class ThemeToggleFacade {
  isDarkMode$ = this.store.select(UserSettingsSelectors.isDarkMode);

  constructor(private readonly store: Store) {}

  onToggleThemeMode(): void {
    this.store.dispatch(UserSettingsActions.toggleThemeMode());
  }
}
