import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { ToggleSwitchComponent } from '@app/components/toggle-switch/toggle-switch.component';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import { User } from '@app/models';
import { AppActions, AppSelectors } from '@app/store/app';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { isTouchDevice } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-user-settings-menu',
  templateUrl: './user-settings-menu.component.html',
  styleUrl: './user-settings-menu.component.scss',
  imports: [CommonModule, MatIconModule, ToggleSwitchComponent, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsMenuComponent implements OnInit {
  @Output() public readonly close = new EventEmitter<void>();

  public isTouchDevice = isTouchDevice();
  public viewModel$?: Observable<{
    user: User | null;
    isDarkMode: boolean;
    isSafeMode: boolean;
    isDesktopView: boolean;
    isWideView: boolean;
  }>;

  constructor(
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.viewModel$ = combineLatest([
      this.store.select(AuthSelectors.selectUser),
      this.store.select(AppSelectors.selectIsDarkMode),
      this.store.select(AppSelectors.selectIsSafeMode),
      this.store.select(AppSelectors.selectIsDesktopView),
      this.store.select(AppSelectors.selectIsWideView),
    ]).pipe(
      untilDestroyed(this),
      map(([user, isDarkMode, isSafeMode, isDesktopView, isWideView]) => ({
        user,
        isDarkMode,
        isSafeMode,
        isDesktopView,
        isWideView,
      })),
    );
  }

  public onToggleTheme(): void {
    this.store.dispatch(AppActions.themeToggled());
  }

  public onToggleSafeMode(): void {
    this.store.dispatch(AppActions.safeModeToggled());
  }

  public onToggleDesktopView(): void {
    this.store.dispatch(AppActions.desktopViewToggled());
  }

  public onToggleWideView(): void {
    this.store.dispatch(AppActions.wideViewToggled());
  }

  public onRefreshData(): void {
    this.store.dispatch(AppActions.refreshAppRequested());
    this.close.emit();
  }

  public onLogin(): void {
    this.router.navigate(['login']);
    this.close.emit();
  }

  public onLogout(): void {
    this.store.dispatch(AuthActions.logoutRequested({ sessionExpired: false }));
    this.close.emit();
  }

  public onChangePassword(): void {
    this.router.navigate(['change-password']);
    this.close.emit();
  }
}
