import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { ToggleSwitchComponent } from '@app/components/toggle-switch/toggle-switch.component';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import IconsModule from '@app/icons';
import { AppActions, AppSelectors } from '@app/store/app';
import { AuthActions } from '@app/store/auth';

@Component({
  selector: 'lcc-user-settings-menu',
  templateUrl: './user-settings-menu.component.html',
  styleUrl: './user-settings-menu.component.scss',
  imports: [CommonModule, IconsModule, ToggleSwitchComponent, TooltipDirective],
})
export class UserSettingsMenuComponent implements OnInit {
  public readonly userSettingsMenuViewModel$ = this.store.select(
    AppSelectors.selectUserSettingsMenuViewModel,
  );

  @Output() public readonly close = new EventEmitter<void>();

  constructor(
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  // Short delay to allow stylesheet to load; otherwise unstyled component flickers briefly
  @HostBinding('style.visibility') private visibility = 'hidden';

  ngOnInit(): void {
    setTimeout(() => (this.visibility = 'visible'), 30);
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
