import { DrawerComponent, type DrawerPosition, type EaWidth } from '@eagami/ui';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { AuthDrawerService } from '@app/services/auth-drawer.service';

import { ForgotPasswordFormComponent } from './forgot-password-form.component';
import { LoginFormComponent } from './login-form.component';

// At or below this viewport width the drawer becomes a bottom sheet.
const MOBILE_BREAKPOINT = 640;

@Component({
  selector: 'lcc-auth-drawer',
  templateUrl: './auth-drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(window:resize)': 'onResize()' },
  imports: [DrawerComponent, LoginFormComponent, ForgotPasswordFormComponent],
})
export class AuthDrawerComponent {
  protected readonly authDrawer = inject(AuthDrawerService);

  private readonly viewportWidth = signal(window.innerWidth);
  private readonly isMobile = computed(() => this.viewportWidth() <= MOBILE_BREAKPOINT);

  // On phones the drawer rises from the bottom as a near full-height sheet, the
  // native mobile pattern; on wider screens it stays a right-hand side panel.
  protected readonly position = computed<DrawerPosition>(() =>
    this.isMobile() ? 'bottom' : 'right',
  );
  protected readonly size = computed<EaWidth>(() => (this.isMobile() ? 'full' : 'md'));

  protected readonly title = computed(() =>
    this.authDrawer.mode() === 'forgot-password' ? 'Reset password' : 'Log in',
  );

  protected onResize(): void {
    this.viewportWidth.set(window.innerWidth);
  }

  // Route the drawer's own closes (X, backdrop, Escape) through close() so the
  // mode resets too, keeping "mode is set before open" an enforced invariant.
  protected onOpenChange(open: boolean): void {
    if (open) {
      this.authDrawer.open.set(true);
    } else {
      this.authDrawer.close();
    }
  }
}
