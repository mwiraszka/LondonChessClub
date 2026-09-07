import { AvatarComponent } from '@eagami/ui';
import { Store } from '@ngrx/store';

import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DropdownDirective } from '@app/directives/dropdown.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import { InternalLink } from '@app/models';
import { RouterLinkPipe } from '@app/pipes';
import { AuthDrawerService, ClerkService } from '@app/services';
import { AppActions, AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { isTouchDevice } from '@app/utils';

@Component({
  selector: 'lcc-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
  imports: [
    AvatarComponent,
    DropdownDirective,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    RouterLinkPipe,
    TooltipDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent {
  private readonly authDrawerService = inject(AuthDrawerService);
  private readonly clerkService = inject(ClerkService);
  private readonly store = inject(Store);

  public readonly links: InternalLink[] = [
    {
      text: 'Home',
      internalPath: '',
      icon: 'home',
    },
    {
      text: 'About',
      internalPath: 'about',
      icon: 'info',
    },
    {
      text: 'Members',
      internalPath: 'members',
      icon: 'groups',
    },
    {
      text: 'Schedule',
      internalPath: 'schedule',
      icon: 'calendar_month',
    },
    {
      text: 'News',
      internalPath: 'news',
      icon: 'map',
    },
    {
      text: 'City Champion',
      internalPath: 'city-champion',
      icon: 'emoji_events',
    },
    {
      text: 'Photo Gallery',
      internalPath: 'photo-gallery',
      icon: 'photo_camera',
    },
    {
      text: 'Game Archives',
      internalPath: 'game-archives',
      icon: 'insert_chart_outlined',
    },
  ];

  public readonly isDarkMode = this.store.selectSignal(AppSelectors.selectIsDarkMode);
  public readonly isDesktopView = this.store.selectSignal(
    AppSelectors.selectIsDesktopView,
  );
  public readonly isWideView = this.store.selectSignal(AppSelectors.selectIsWideView);
  public readonly user = this.store.selectSignal(AuthSelectors.selectUser);

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

  public isTouchDevice = isTouchDevice();
  public isDropdownOpen = false;
  public screenWidth = window.innerWidth;

  @HostListener('window:resize')
  onResize(): void {
    this.screenWidth = window.innerWidth;
  }

  public onToggleTheme(): void {
    this.store.dispatch(AppActions.themeToggled());
  }

  public onToggleWideView(): void {
    this.store.dispatch(AppActions.wideViewToggled());
  }

  public onToggleDesktopView(): void {
    this.store.dispatch(AppActions.desktopViewToggled());
  }

  public onLogin(): void {
    this.authDrawerService.openLogin();
  }
}
