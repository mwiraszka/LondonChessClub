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

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import IconsModule from '@app/icons';
import { DIALOG_CONFIG_TOKEN } from '@app/services';
import type { DialogConfig, DialogOutput } from '@app/types';

@Component({
  selector: 'lcc-dialog',
  template: `
    <header>
      <i-feather
        name="x"
        class="close-icon"
        [tooltip]="'Close'"
        (click)="result.emit('close')">
      </i-feather>
    </header>

    <ng-template #contentContainer></ng-template>
  `,
  styleUrl: './dialog.component.scss',
  imports: [IconsModule, TooltipDirective],
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

      this.contentComponentRef.instance.dialogResult.pipe().subscribe(result => {
        this.result.emit(result);
      });
    }
  }
}
