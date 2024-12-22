import { UntilDestroy } from '@ngneat/until-destroy';

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
import { IconsModule } from '@app/icons';
import { DIALOG_DATA_TOKEN, DialogData } from '@app/services';
import { DialogControls } from '@app/types';

@UntilDestroy()
@Component({
  selector: 'lcc-dialog',
  template: `
    <header>
      <i-feather
        name="x"
        class="close-icon"
        [tooltip]="'Close'"
        (click)="close.emit()">
      </i-feather>
    </header>

    <ng-template #contentContainer></ng-template>
  `,
  styleUrls: ['./dialog.component.scss'],
  imports: [IconsModule, TooltipDirective],
})
export class DialogComponent<T extends DialogControls> implements AfterViewInit {
  @ViewChild('contentContainer', { read: ViewContainerRef })
  private containerRef?: ViewContainerRef;
  private contentComponentRef?: ComponentRef<T>;

  @Output() public close = new EventEmitter<void>();
  @Output() public confirm = new EventEmitter<string>();

  constructor(@Inject(DIALOG_DATA_TOKEN) private dialogData: DialogData<T>) {}

  ngAfterViewInit(): void {
    this.contentComponentRef = this.containerRef?.createComponent<T>(
      this.dialogData.component,
    );

    for (let key in this.dialogData.inputs) {
      this.contentComponentRef?.setInput(key, this.dialogData.inputs[key]);
    }

    this.contentComponentRef?.instance.close.subscribe(() => this.close.emit());
    this.contentComponentRef?.instance.confirm.subscribe((confirm: string) =>
      this.confirm.emit(confirm),
    );
  }
}
