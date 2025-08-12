import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DataToolbarComponent } from '@app/components/data-toolbar/data-toolbar.component';
import { MembersTableComponent } from '@app/components/members-table/members-table.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { DataDisplayOptions, FiltersRecord, Member, PageSize } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { MembersActions, MembersSelectors } from '@app/store/members';

@UntilDestroy()
@Component({
  selector: 'lcc-members-page',
  templateUrl: './members-page.component.html',
  styleUrl: './members-page.component.scss',
  imports: [
    CommonModule,
    DataToolbarComponent,
    MembersTableComponent,
    PageHeaderComponent,
  ],
})
export class MembersPageComponent implements OnInit {
  public searchPlaceholder = 'Search name, city, etc.';

  public viewModel$?: Observable<{
    isAdmin: boolean;
    isSafeMode: boolean;
    members: Member[];
    options: DataDisplayOptions<Member>;
    collectionTotal: number;
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
      this.store.select(MembersSelectors.selectAllMembers),
      this.store.select(AuthSelectors.selectIsAdmin),
      this.store.select(AppSelectors.selectIsSafeMode),
      this.store.select(MembersSelectors.selectOptions),
      this.store.select(MembersSelectors.selectCollectionTotal),
    ]).pipe(
      untilDestroyed(this),
      map(([members, isAdmin, isSafeMode, options, collectionTotal]) => ({
        isAdmin,
        isSafeMode,
        members,
        options,
        collectionTotal,
      })),
    );
  }

  public onFiltersChange(filters: FiltersRecord): void {
    this.store.dispatch(MembersActions.filtersChanged({ filters }));
  }

  public onPageChange(pageNum: number): void {
    this.store.dispatch(MembersActions.pageChanged({ pageNum }));
  }

  public onPageSizeChange(pageSize: PageSize): void {
    this.store.dispatch(MembersActions.pageSizeChanged({ pageSize }));
  }

  public onSearchChange(searchQuery: string): void {
    this.store.dispatch(MembersActions.searchQueryChanged({ searchQuery }));
  }
}
