import { Store } from '@ngrx/store';
import { Observable, timer } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

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
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { isDefined } from '@app/utils';

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
  @Input({ required: true }) sessionDurationMs!: number;

  @Output() public dialogResult = new EventEmitter<SessionExpiryDialogResult | 'close'>();

  public timeRemainingSecs$!: Observable<number>;

  private enterKeyListener!: () => void;
  private readonly renderer!: Renderer2;

  constructor(
    private readonly rendererFactory: RendererFactory2,
    private readonly store: Store,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public ngOnInit(): void {
    this.timeRemainingSecs$ = this.store
      .select(AuthSelectors.selectSessionStartTime)
      .pipe(
        filter(isDefined),
        map(startTime =>
          Math.max(
            0,
            Math.floor((startTime + this.sessionDurationMs - Date.now()) / 1000),
          ),
        ),
        switchMap(initialSecs =>
          timer(0, 1000).pipe(
            tap(timeElapsed => {
              if (initialSecs - timeElapsed <= 0) {
                this.store.dispatch(
                  AuthActions.logoutRequested({ sessionExpired: true }),
                );
                this.dialogResult.emit('close');
              }
            }),
          ),
        ),
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
