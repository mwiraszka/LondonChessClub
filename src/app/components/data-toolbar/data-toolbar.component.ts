import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CommonModule, KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TooltipDirective } from '@app/directives/tooltip.directive';
import { Entity, Filter, FiltersRecord, PageSize } from '@app/models';

@UntilDestroy()
@Component({
  selector: 'lcc-data-toolbar',
  templateUrl: './data-toolbar.component.html',
  styleUrls: ['./data-toolbar.component.scss'],
  imports: [CommonModule, MatIconModule, TooltipDirective],
})
export class DataToolbarComponent {
  public readonly PAGE_SIZES: PageSize[] = [10, 20, 50, 100];

  @Input({ required: true }) public entity!: Entity;
  @Input({ required: true }) public pageNum!: number;
  @Input({ required: true }) public pageSize!: PageSize;
  @Input({ required: true }) public searchQuery!: string;
  @Input({ required: true }) public totalItems!: number;

  @Input() public filters?: FiltersRecord;
  @Input() public searchPlaceholder: string = 'Search';

  @Output() public filtersChange = new EventEmitter<FiltersRecord>();
  @Output() public pageChange = new EventEmitter<number>();
  @Output() public pageSizeChange = new EventEmitter<PageSize>();
  @Output() public searchChange = new EventEmitter<string>();

  public isSearchFocused = false;

  public get lastPage(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  public onFirstPage(): void {
    this.onPageChange(1);
  }

  public onPreviousPage(): void {
    this.onPageChange(this.pageNum - 1);
  }

  public onNextPage(): void {
    this.onPageChange(this.pageNum + 1);
  }

  public onLastPage(): void {
    this.onPageChange(this.lastPage);
  }

  public onPageChange(pageNum: number): void {
    this.pageChange.emit(pageNum);
  }

  public onPageSizeChange(pageSize: PageSize): void {
    this.pageSizeChange.emit(pageSize);
  }

  public onSearchQueryChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  public onToggleFilter(filter: KeyValue<string, Filter>): void {
    if (!this.filters) {
      return;
    }

    const filters = {
      ...this.filters,
      [filter.key]: { ...filter.value, value: !filter.value.value },
    };
    this.filtersChange.emit(filters);
  }

  public originalOrder = () => 0;
}
