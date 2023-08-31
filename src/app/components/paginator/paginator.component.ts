import { ClarityIcons, angleIcon, stepForward2Icon } from '@cds/core/icon';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lcc-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit {
  PAGE_SIZES = [10, 20, 50, 100];

  @Input() pageNum = 1;
  @Input() pageSize = this.PAGE_SIZES[1];
  @Input() totalItems!: number;
  @Input() typeOfItems = 'items';

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  ngOnInit(): void {
    ClarityIcons.addIcons(angleIcon, stepForward2Icon);
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
