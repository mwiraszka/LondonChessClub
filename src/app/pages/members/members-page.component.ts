import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AdminToolbarComponent } from '@app/components/admin-toolbar/admin-toolbar.component';
import { DataToolbarComponent } from '@app/components/data-toolbar/data-toolbar.component';
import { MembersTableComponent } from '@app/components/members-table/members-table.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { AdminButton, DataPaginationOptions, InternalLink, Member } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { MembersActions, MembersSelectors } from '@app/store/members';
import { isSecondsInPast } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-members-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        title="Members"
        icon="groups">
      </lcc-page-header>

      @if (vm.isAdmin) {
        <input
          #fileInput
          type="file"
          accept=".csv"
          style="display: none"
          (change)="onFileSelected($event)" />
        <lcc-admin-toolbar
          [adminLinks]="[addMemberLink]"
          [adminButtons]="adminButtons">
        </lcc-admin-toolbar>
      }

      <lcc-data-toolbar
        entity="members"
        [filteredCount]="vm.filteredCount"
        [options]="vm.options"
        searchPlaceholder="Search by name, city or username"
        (optionsChange)="onOptionsChange($event)"
        (optionsChangeNoFetch)="onOptionsChange($event, false)">
      </lcc-data-toolbar>

      <lcc-members-table
        [isAdmin]="vm.isAdmin"
        [isSafeMode]="vm.isSafeMode"
        [members]="vm.members"
        [options]="vm.options"
        (optionsChange)="onOptionsChange($event)"
        (requestDeleteMember)="onRequestDeleteMember($event)">
      </lcc-members-table>
    }
  `,
  imports: [
    AdminToolbarComponent,
    CommonModule,
    DataToolbarComponent,
    MembersTableComponent,
    PageHeaderComponent,
  ],
})
export class MembersPageComponent implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  public addMemberLink: InternalLink = {
    internalPath: ['member', 'add'],
    text: 'Add a member',
    icon: 'add_circle_outline',
  };

  public adminButtons: AdminButton[] = [
    {
      id: 'import-from-csv',
      tooltip: 'Import from CSV',
      icon: 'upload_file',
      action: () => this.fileInput?.nativeElement.click(),
    },
    {
      id: 'export-to-csv',
      tooltip: 'Export to CSV',
      icon: 'download',
      action: () => this.onExportToCsv(),
    },
  ];

  public viewModel$?: Observable<{
    filteredCount: number;
    isAdmin: boolean;
    isSafeMode: boolean;
    members: Member[];
    options: DataPaginationOptions<Member>;
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
      this.store.select(MembersSelectors.selectFilteredCount),
      this.store.select(AuthSelectors.selectIsAdmin),
      this.store.select(AppSelectors.selectIsSafeMode),
      this.store.select(MembersSelectors.selectMembers),
      this.store.select(MembersSelectors.selectOptions),
    ]).pipe(
      untilDestroyed(this),
      map(([filteredCount, isAdmin, isSafeMode, members, options]) => ({
        filteredCount,
        isAdmin,
        isSafeMode,
        members,
        options,
      })),
    );
  }

  public onOptionsChange(options: DataPaginationOptions<Member>, fetch = true): void {
    this.store.dispatch(MembersActions.paginationOptionsChanged({ options, fetch }));
  }

  public onRequestDeleteMember(member: Member): void {
    this.store.dispatch(MembersActions.deleteMemberRequested({ member }));
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.store.dispatch(MembersActions.importMembersFromCsvRequested({ file }));
      // Reset input so the same file can be selected again
      input.value = '';
    }
  }

  public onExportToCsv(): void {
    this.store.dispatch(MembersActions.exportMembersToCsvRequested());
  }
}
