import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Filter } from '@app/models';

@Component({
  selector: 'lcc-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  providers: [CommonModule],
})
export class FiltersComponent {
  @Input({ required: true }) filters!: Filter[];

  // TODO: Store as Record instead of array; pass around single changed record instead wherever possible
  @Output() filtersChange = new EventEmitter<Filter[]>();

  public onToggleFilter(filter: Filter): void {
    // TODO: fix up
    this.filters = [...this.filters, filter];
    this.filtersChange.emit(this.filters);
  }
}
