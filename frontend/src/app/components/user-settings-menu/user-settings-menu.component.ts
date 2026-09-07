import { AvatarComponent } from '@eagami/ui';
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
  computed,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { ToggleSwitchComponent } from '@app/components/toggle-switch/toggle-switch.component';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import { User } from '@app/models';
import { AuthDrawerService, ClerkService } from '@app/services';
import { AppActions, AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { isTouchDevice } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-user-settings-menu',
  templateUrl: './user-settings-menu.component.html',
  styleUrl: './user-settings-menu.component.scss',
  imports: [
    AvatarComponent,
    CommonModule,
    MatIconModule,
    ToggleSwitchComponent,
    TooltipDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsMenuComponent implements OnInit {
  @Output() public readonly close = new EventEmitter<void>();

  private readonly authDrawerService = inject(AuthDrawerService);
  private readonly clerkService = inject(ClerkService);

  public isTouchDevice = isTouchDevice();
  public viewModel$?: Observable<{
    user: User | null;
    isDarkMode: boolean;
    isSafeMode: boolean;
    isDesktopView: boolean;
    isWideView: boolean;
  }>;

  // Clerk serves the cropped display avatar; the R2 original is editor-only
  public readonly avatarSrc = computed(() => {
    const user = this.clerkService.user();
    return user?.hasImage ? user.imageUrl : undefined;
  });

  public readonly initials = computed(() => {
    const user = this.clerkService.user();
    const first = user?.firstName?.[0] ?? '';
    const last = user?.lastName?.[0] ?? '';
    return (first + last).toUpperCase() || undefined;
  });

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
    this.authDrawerService.openLogin();
    this.close.emit();
  }

  public onAccount(): void {
    this.router.navigate(['account']);
    this.close.emit();
  }

  public async onLogout(): Promise<void> {
    this.close.emit();
    await this.clerkService.logOut();
    this.router.navigate(['/']);
  }
}
