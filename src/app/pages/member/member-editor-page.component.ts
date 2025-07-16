import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { MemberFormComponent } from '@app/components/member-form/member-form.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import type { EditorPage, InternalLink, Member, MemberFormData } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { AppSelectors } from '@app/store/app';
import { MembersSelectors } from '@app/store/members';

@UntilDestroy()
@Component({
  selector: 'lcc-member-editor-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [title]="vm.pageTitle">
      </lcc-page-header>
      <lcc-member-form
        [formData]="vm.formData"
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [isSafeMode]="vm.isSafeMode"
        [originalMember]="vm.originalMember">
      </lcc-member-form>
      <lcc-link-list [links]="[membersPageLink]"></lcc-link-list>
    }
  `,
  imports: [CommonModule, LinkListComponent, MemberFormComponent, PageHeaderComponent],
})
export class MemberEditorPageComponent implements EditorPage, OnInit {
  public readonly entity = 'member';
  public readonly membersPageLink: InternalLink = {
    text: 'See all members',
    internalPath: 'members',
  };
  public viewModel$?: Observable<{
    formData: MemberFormData;
    hasUnsavedChanges: boolean;
    isSafeMode: boolean;
    originalMember: Member | null;
    pageTitle: string;
  }>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.viewModel$ = this.activatedRoute.params.pipe(
      untilDestroyed(this),
      map(params => (params['member_id'] ?? null) as string | null),
      switchMap(memberId =>
        combineLatest([
          this.store.select(MembersSelectors.selectMemberById(memberId)),
          this.store.select(MembersSelectors.selectMemberFormDataById(memberId)),
          this.store.select(MembersSelectors.selectHasUnsavedChanges(memberId)),
          this.store.select(AppSelectors.selectIsSafeMode),
        ]),
      ),
      map(([originalMember, formData, hasUnsavedChanges, isSafeMode]) => ({
        originalMember,
        formData,
        hasUnsavedChanges,
        isSafeMode,
        pageTitle: originalMember
          ? `Edit ${originalMember.firstName} ${originalMember.lastName}`
          : 'Add a member',
      })),
      tap(viewModel => {
        this.metaAndTitleService.updateTitle(viewModel.pageTitle);
        this.metaAndTitleService.updateDescription(
          `${viewModel.pageTitle} for the London Chess Club.`,
        );
      }),
    );
  }
}
