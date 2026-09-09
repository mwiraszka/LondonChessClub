import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { ClerkService } from '@app/services';

// Hosts Clerk's prebuilt reset-password task screen, shown when an admin has
// flagged the user's (temporary) password as compromised and a new one must be
// set before the session becomes active.
@Component({
  selector: 'lcc-reset-password-task-page',
  templateUrl: './reset-password-task-page.component.html',
  styleUrl: './reset-password-task-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordTaskPageComponent implements AfterViewInit, OnDestroy {
  private readonly clerkService = inject(ClerkService);
  private readonly router = inject(Router);

  private readonly taskContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('taskContainer');

  private mounted = false;

  ngAfterViewInit(): void {
    if (this.clerkService.client.session?.currentTask?.key === 'reset-password') {
      this.clerkService.client.mountTaskResetPassword(this.taskContainer().nativeElement);
      this.mounted = true;
    } else {
      void this.router.navigateByUrl('/');
    }
  }

  ngOnDestroy(): void {
    if (this.mounted) {
      this.clerkService.client.unmountTaskResetPassword(
        this.taskContainer().nativeElement,
      );
    }
  }
}
