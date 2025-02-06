import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { MemberFormComponent } from '@app/components/member-form/member-form.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import type { InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { MembersSelectors } from '@app/store/members';

@UntilDestroy()
@Component({
  selector: 'lcc-member-editor-screen',
  templateUrl: './member-editor-screen.component.html',
  imports: [CommonModule, LinkListComponent, MemberFormComponent, ScreenHeaderComponent],
})
export class MemberEditorScreenComponent implements OnInit {
  public readonly selectMemberEditorViewModel$ = this.store.select(
    MembersSelectors.selectMemberEditorViewModel,
  );

  public links: InternalLink[] = [
    {
      text: 'See all members',
      internalPath: 'members',
      icon: 'users',
    },
    {
      text: 'Return home',
      internalPath: '',
      icon: 'home',
    },
  ];

  constructor(
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.selectMemberEditorViewModel$
      .pipe(untilDestroyed(this))
      .subscribe(({ memberName, controlMode }) => {
        const screenTitle =
          controlMode === 'edit' && memberName ? `Edit ${memberName}` : 'Add a member';
        this.metaAndTitleService.updateTitle(screenTitle);
        this.metaAndTitleService.updateDescription(
          `${screenTitle} for the London Chess Club.`,
        );
      });
  }
}
