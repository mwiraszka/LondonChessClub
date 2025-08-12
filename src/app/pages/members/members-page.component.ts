import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DataToolbarComponent } from '@app/components/data-toolbar/data-toolbar.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { MembersTableComponent } from '@app/components/members-table/members-table.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { DataPaginationOptions, InternalLink, Member } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { MembersActions, MembersSelectors } from '@app/store/members';
import { isSecondsInPast } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-members-page',
  templateUrl: './members-page.component.html',
  styleUrl: './members-page.component.scss',
  imports: [
    CommonModule,
    DataToolbarComponent,
    LinkListComponent,
    MembersTableComponent,
    PageHeaderComponent,
  ],
})
export class MembersPageComponent implements OnInit {
  public addMemberLink: InternalLink = {
    internalPath: ['member', 'add'],
    text: 'Add a member',
    icon: 'add_circle_outline',
  };

  public viewModel$?: Observable<{
    filteredCount: number;
    isAdmin: boolean;
    isSafeMode: boolean;
    members: Member[];
    options: DataPaginationOptions<Member>;
    totalCount: number;
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

    this.store
      .select(MembersSelectors.selectLastFetch)
      .pipe(take(1))
      .subscribe(lastFetch => {
        if (!lastFetch || isSecondsInPast(lastFetch, 600)) {
          this.store.dispatch(MembersActions.fetchMembersRequested());
        }
      });

    this.viewModel$ = combineLatest([
      this.store.select(MembersSelectors.selectAllMembers),
      this.store.select(AuthSelectors.selectIsAdmin),
      this.store.select(AppSelectors.selectIsSafeMode),
      this.store.select(MembersSelectors.selectOptions),
      this.store.select(MembersSelectors.selectFilteredCount),
      this.store.select(MembersSelectors.selectTotalCount),
    ]).pipe(
      untilDestroyed(this),
      map(([members, isAdmin, isSafeMode, options, filteredCount, totalCount]) => ({
        filteredCount,
        isAdmin,
        isSafeMode,
        members,
        options,
        totalCount,
      })),
    );
  }

  public onOptionsChange(options: DataPaginationOptions<Member>, fetch = true): void {
    console.log(':: fetch', fetch, options);
    this.store.dispatch(MembersActions.paginationOptionsChanged({ options, fetch }));
  }

  public onRequestDeleteMember(member: Member): void {
    this.store.dispatch(MembersActions.deleteMemberRequested({ member }));
  }
}
