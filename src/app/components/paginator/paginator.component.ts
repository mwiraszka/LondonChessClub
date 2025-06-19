import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TooltipDirective } from '@app/directives/tooltip.directive';

@Component({
  selector: 'lcc-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  imports: [MatIconModule, TooltipDirective],
})
export class PaginatorComponent implements OnChanges {
  public readonly PAGE_SIZES = [10, 20, 50, 100];

  @Input() public pageNum = 1;
  @Input() public totalItems = 0;
  @Input() public typeOfItems = 'items';
  @Input() public pageSize = this.PAGE_SIZES[1];

  @Output() public pageChange = new EventEmitter<number>();
  @Output() public pageSizeChange = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems']) {
      // setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.PAGE_SIZES[this.PAGE_SIZES.length - 1] = this.totalItems;

        if (this.pageSize > this.PAGE_SIZES[2]) {
          this.pageSize = this.totalItems;
          this.onPageSizeChange(this.totalItems);
        }
      });
    }
  }

  public onFirst(): void {
    this.onPageChange(1);
  }

  public onPrevious(): void {
    this.onPageChange(this.pageNum - 1);
  }

  public onNext(): void {
    this.onPageChange(this.pageNum + 1);
  }

  public onLast(): void {
    this.onPageChange(this.lastPage());
  }

  public lastPage(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  public onPageChange(pageNum: number): void {
    this.pageChange.emit(pageNum);
  }

  public onPageSizeChange(pageSize: number): void {
    this.pageSizeChange.emit(pageSize);
  }
}
