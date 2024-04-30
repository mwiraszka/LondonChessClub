import { untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { MetaAndTitleService } from '@app/services';

import { MemberEditorFacade } from './member-editor.facade';

@Component({
  selector: 'lcc-member-editor',
  templateUrl: './member-editor.component.html',
  styleUrls: ['./member-editor.component.scss'],
  providers: [MemberEditorFacade],
})
export class MemberEditorComponent implements OnInit {
  constructor(
    public facade: MemberEditorFacade,
    private metaAndTitleService: MetaAndTitleService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.facade.selectedMemberName$, this.facade.isEditMode$])
      .pipe(untilDestroyed(this))
      .subscribe(([memberName, isEditMode]) => {
        const screenTitle =
          isEditMode && memberName ? `Edit ${memberName}` : 'Add a member';
        this.metaAndTitleService.updateTitle(screenTitle);
        this.metaAndTitleService.updateDescription(
          `${screenTitle} for the London Chess Club.`,
        );
      });
  }
}
