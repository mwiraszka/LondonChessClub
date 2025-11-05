import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';

import { DialogOutput, SessionExpiryDialogResult } from '@app/models';
import { DurationPipe } from '@app/pipes';

@UntilDestroy()
@Component({
  selector: 'lcc-session-expiry-dialog',
  template: `
    <h3 class="dialog-title">Session expiring</h3>

    <div class="dialog-body">
      <p>
        Your session will expire in
        <span class="time-remaining-text">
          {{ timeRemainingSecs$ | async | duration }}
        </span>
        due to inactivity. Any unsaved progress will be lost!
      </p>
      <p>Would you like to extend your session?</p>
    </div>

    <div class="buttons-container">
      <button
        class="cancel-button lcc-secondary-button lcc-dark-button"
        (click)="dialogResult.emit('cancel')">
        Cancel
      </button>
      <button
        class="logout-button lcc-warning-button"
        (click)="dialogResult.emit('logout')">
        Log out
      </button>
      <button
        class="extend-button lcc-primary-button"
        (click)="dialogResult.emit('extend')">
        Extend
      </button>
    </div>
  `,
  styleUrl: 'session-expiry-dialog.component.scss',
  imports: [CommonModule, DurationPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionExpiryDialogComponent
  implements DialogOutput<SessionExpiryDialogResult>
{
  @Input({ required: true }) initialTimeRemainingSecs!: number;

  @Output() public dialogResult = new EventEmitter<SessionExpiryDialogResult | 'close'>();

  public timeRemainingSecs$!: Observable<number>;

  private enterKeyListener!: () => void;

  constructor(private readonly renderer: Renderer2) {}

  public ngOnInit(): void {
    this.timeRemainingSecs$ = timer(0, 1000).pipe(
      untilDestroyed(this),
      map(timeElapsed => this.initialTimeRemainingSecs - timeElapsed),
      tap(timeRemaining => {
        if (timeRemaining <= 0) {
          this.dialogResult.emit('expire');
        }
      }),
    );

    this.enterKeyListener = this.renderer.listen(
      'document',
      'keydown.enter',
      (event: KeyboardEvent) => {
        event.preventDefault();
        this.dialogResult.emit('extend');
      },
    );
  }

  public ngOnDestroy(): void {
    this.enterKeyListener();
  }
}
