import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@UntilDestroy()
@Component({
  selector: 'lcc-search',
  template: `
    <input
      id="search"
      type="text"
      [placeholder]="placeholder"
      [value]="searchQuery"
      (input)="onInputChange($event)" />
  `,
  imports: [CommonModule],
})
export class SearchComponent implements OnInit {
  @Input() placeholder: string = 'Search';
  @Input() searchQuery: string = '';

  @Output() searchChange = new EventEmitter<string>();

  private searchSubject = new BehaviorSubject<string>('');

  public ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), untilDestroyed(this))
      .subscribe(value => {
        this.searchChange.emit(value);
      });
  }

  public onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }
}
