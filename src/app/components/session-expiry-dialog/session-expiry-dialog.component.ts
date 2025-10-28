import { Observable, interval } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

import { DialogOutput, SessionExpiryDialogResult } from '@app/models';
import { DurationPipe } from '@app/pipes';

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
        due to inactivity. Any unsaved progress may be lost.
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
  styles: `
    :host {
      width: 430px !important;
      display: flex;
      flex-direction: column;
      gap: 16px;
      text-align: start;
      padding: 16px 32px;

      .dialog-title {
        padding-bottom: 4px;
        border-bottom: 1px solid var(--lcc-color--sessionExpiryDialog-dividerLine);
      }

      .dialog-body {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .time-remaining-text {
          font-weight: bold;
          color: var(--lcc-color--sessionExpiryDialog-timeRemainingText);
        }
      }

      .buttons-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }
    }
  `,
  imports: [CommonModule, DurationPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionExpiryDialogComponent
  implements DialogOutput<SessionExpiryDialogResult>
{
  @Input({ required: true }) initialTimeToExpiryMs!: number;

  @Output() public dialogResult = new EventEmitter<SessionExpiryDialogResult | 'close'>();

  public timeRemainingSecs$!: Observable<number>;

  private enterKeyListener!: () => void;
  private readonly renderer!: Renderer2;

  constructor(private readonly rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public ngOnInit(): void {
    this.timeRemainingSecs$ = interval(1000).pipe(
      map(tick => this.initialTimeToExpiryMs / 1000 - tick),
      takeWhile(timeRemaining => timeRemaining > 0),
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
