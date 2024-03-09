import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'lcc-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnChanges {
  pageSizes = [10, 20, 50, 100];

  @Input() pageNum = 1;
  @Input() totalItems = 0;
  @Input() typeOfItems = 'items';
  @Input() pageSize = this.pageSizes[1];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems']) {
      this.pageSizes[this.pageSizes.length - 1] = this.totalItems;

      if (this.pageSize > this.pageSizes[2]) {
        this.pageSize = this.totalItems;
        this.onPageSizeChange(this.totalItems);
      }
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
