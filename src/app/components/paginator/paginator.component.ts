import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';

@Component({
  selector: 'lcc-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  imports: [CommonModule, IconsModule, TooltipDirective],
})
export class PaginatorComponent implements OnChanges {
  readonly PAGE_SIZES = [10, 20, 50, 100];

  @Input() pageNum = 1;
  @Input() totalItems = 0;
  @Input() typeOfItems = 'items';
  @Input() pageSize = this.PAGE_SIZES[1];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems']) {
      // setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.PAGE_SIZES[this.PAGE_SIZES.length - 1] = this.totalItems;

        if (this.pageSize > this.PAGE_SIZES[2]) {
          this.pageSize = this.totalItems;
          this.onPageSizeChange(this.totalItems);
        }
      }, 0);
    }
  }

  onFirst(): void {
    this.onPageChange(1);
  }

  onPrevious(): void {
    this.onPageChange(this.pageNum - 1);
  }

  onNext(): void {
    this.onPageChange(this.pageNum + 1);
  }

  onLast(): void {
    this.onPageChange(this.lastPage());
  }

  lastPage(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  onPageChange(pageNum: number): void {
    this.pageChange.emit(pageNum);
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSizeChange.emit(pageSize);
  }
}
