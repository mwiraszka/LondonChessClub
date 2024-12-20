import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { MemberFormComponent } from '@app/components/member-form/member-form.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';
import { MembersSelectors } from '@app/store/members';
import { Link, NavPathTypes } from '@app/types';

@UntilDestroy()
@Component({
  selector: 'lcc-member-editor',
  templateUrl: './member-editor.component.html',
  styleUrls: ['./member-editor.component.scss'],
  imports: [CommonModule, LinkListComponent, MemberFormComponent, ScreenHeaderComponent],
})
export class MemberEditorComponent implements OnInit {
  public readonly selectMemberEditorViewModel$ = this.store.select(
    MembersSelectors.selectMemberEditorViewModel,
  );

  public links: Link[] = [
    {
      icon: 'users',
      path: NavPathTypes.MEMBERS,
      text: 'See all members',
    },
    {
      icon: 'home',
      path: NavPathTypes.HOME,
      text: 'Return home',
    },
  ];

  constructor(
    private readonly store: Store,
    private metaAndTitleService: MetaAndTitleService,
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
