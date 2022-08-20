import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { angleIcon, ClarityIcons, stepForward2Icon } from '@cds/core/icon';

@Component({
  selector: 'lcc-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit {
  PAGE_SIZES = [10, 20, 50, 100];
  page = 1;

  @Input() pageSize = this.PAGE_SIZES[0];
  @Input() totalItems!: number;
  @Input() typeOfItems = 'items';
  @Output() update = new EventEmitter<[number, number]>();

  ngOnInit(): void {
    ClarityIcons.addIcons(angleIcon);
    ClarityIcons.addIcons(stepForward2Icon);
    this.onPageChange(this.page);
  }

  onFirst(): void {
    this.onPageChange(1);
  }

  onPrevious(): void {
    this.onPageChange(this.page - 1);
  }

  onNext(): void {
    this.onPageChange(this.page + 1);
  }

  onLast(): void {
    this.onPageChange(this.lastPage());
  }

  lastPage(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  onPageChange(newPage: number): void {
    this.onUpdate(newPage, this.pageSize);
  }

  onPageSizeChange(newPageSize: number): void {
    this.onUpdate(1, newPageSize);
  }

  private onUpdate(page: number, pageSize: number): void {
    this.page = page;
    this.pageSize = pageSize;
    this.update.emit([this.pageSize * (this.page - 1), this.pageSize * page]);
  }
}
