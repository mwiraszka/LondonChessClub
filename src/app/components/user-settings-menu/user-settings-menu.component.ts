import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { ToggleSwitchComponent } from '@app/components/toggle-switch/toggle-switch.component';
import { User } from '@app/models';
import { AppActions, AppSelectors } from '@app/store/app';
import { AuthActions, AuthSelectors } from '@app/store/auth';

@UntilDestroy()
@Component({
  selector: 'lcc-user-settings-menu',
  templateUrl: './user-settings-menu.component.html',
  styleUrl: './user-settings-menu.component.scss',
  imports: [CommonModule, MatIconModule, ToggleSwitchComponent],
})
export class UserSettingsMenuComponent implements OnInit {
  public viewModel$?: Observable<{
    user: User | null;
    isDarkMode: boolean;
    isSafeMode: boolean;
  }>;

  @Output() public readonly close = new EventEmitter<void>();

  constructor(
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.viewModel$ = combineLatest([
      this.store.select(AuthSelectors.selectUser),
      this.store.select(AppSelectors.selectIsDarkMode),
      this.store.select(AppSelectors.selectIsSafeMode),
    ]).pipe(
      untilDestroyed(this),
      map(([user, isDarkMode, isSafeMode]) => ({
        user,
        isDarkMode,
        isSafeMode,
      })),
    );
  }

  public onToggleTheme(): void {
    this.store.dispatch(AppActions.themeToggled());
  }

  public onToggleSafeMode(): void {
    this.store.dispatch(AppActions.safeModeToggled());
  }

  public onLogin(): void {
    this.router.navigate(['login']);
    this.close.emit();
  }

  public onLogout(): void {
    this.store.dispatch(AuthActions.logoutRequested({}));
    this.close.emit();
  }

  public onChangePassword(): void {
    this.router.navigate(['change-password']);
    this.close.emit();
  }
}
