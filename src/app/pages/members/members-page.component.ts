import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { FiltersComponent } from '@app/components/filters/filters.component';
import { MembersTableComponent } from '@app/components/members-table/members-table.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { PaginatorComponent } from '@app/components/paginator/paginator.component';
import { SearchComponent } from '@app/components/search/search.component';
import { CollectionDisplayOptions, Filter, Member } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { MembersActions, MembersSelectors } from '@app/store/members';

@UntilDestroy()
@Component({
  selector: 'lcc-members-page',
  templateUrl: './members-page.component.html',
  imports: [
    CommonModule,
    FiltersComponent,
    MembersTableComponent,
    PageHeaderComponent,
    PaginatorComponent,
    SearchComponent,
  ],
})
export class MembersPageComponent implements OnInit {
  public searchPlaceholder = 'Search name, city, username, etc.';

  public viewModel$?: Observable<{
    filteredMembers: Member[];
    isAdmin: boolean;
    isSafeMode: boolean;
    options: CollectionDisplayOptions<Member>;
    totalMemberCount: number;
  }>;

  constructor(
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Members');
    this.metaAndTitleService.updateDescription(
      'Club ratings and other members information',
    );

    this.store.dispatch(MembersActions.fetchMembersRequested());

    this.viewModel$ = combineLatest([
      this.store.select(MembersSelectors.selectFilteredMembers),
      this.store.select(AuthSelectors.selectIsAdmin),
      this.store.select(AppSelectors.selectIsSafeMode),
      this.store.select(MembersSelectors.selectOptions),
      this.store.select(MembersSelectors.selectTotalMemberCount),
    ]).pipe(
      untilDestroyed(this),
      map(([filteredMembers, isAdmin, isSafeMode, options, totalMemberCount]) => ({
        filteredMembers,
        isAdmin,
        isSafeMode,
        options,
        totalMemberCount,
      })),
    );
  }

  public onFiltersChange(filters: Filter[]): void {
    this.store.dispatch(MembersActions.filtersChanged({ filters }));
  }

  public onPageChange(pageNum: number): void {
    this.store.dispatch(MembersActions.pageChanged({ pageNum }));
  }

  public onPageSizeChange(pageSize: number): void {
    this.store.dispatch(MembersActions.pageSizeChanged({ pageSize }));
  }

  public onSearchChange(searchQuery: string): void {
    this.store.dispatch(MembersActions.searchQueryChanged({ searchQuery }));
  }
}
