import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import {
  AfterViewInit,
  Component,
  ComponentRef,
  EventEmitter,
  Inject,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { DialogConfig, DialogOutput } from '@app/models';
import { DIALOG_CONFIG_TOKEN } from '@app/services';

@UntilDestroy()
@Component({
  selector: 'lcc-dialog',
  template: `
    <header>
      <button
        class="close-button lcc-icon-button"
        (click)="result.emit('close')">
        <mat-icon>close</mat-icon>
      </button>
    </header>
    <ng-template #contentContainer></ng-template>
  `,
  styleUrl: './dialog.component.scss',
  imports: [MatIconModule],
})
export class DialogComponent<TComponent extends DialogOutput<TResult>, TResult>
  implements AfterViewInit
{
  @ViewChild('contentContainer', { read: ViewContainerRef })
  private containerRef?: ViewContainerRef;
  private contentComponentRef?: ComponentRef<TComponent>;

  @Output() public result = new EventEmitter<TResult | 'close'>();

  constructor(
    @Inject(DIALOG_CONFIG_TOKEN) private dialogConfig: DialogConfig<TComponent>,
  ) {}

  ngAfterViewInit(): void {
    this.contentComponentRef = this.containerRef?.createComponent<TComponent>(
      this.dialogConfig.componentType,
    );

    if (this.contentComponentRef) {
      for (const key in this.dialogConfig.inputs) {
        this.contentComponentRef.setInput(key, this.dialogConfig.inputs[key]);
      }

      this.contentComponentRef.instance.dialogResult
        .pipe(untilDestroyed(this))
        .subscribe(result => {
          this.result.emit(result);
        });
    }
  }
}
