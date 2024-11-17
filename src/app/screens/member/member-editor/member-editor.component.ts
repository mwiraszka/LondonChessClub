import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { MetaAndTitleService } from '@app/services';

import { MemberEditorFacade } from './member-editor.facade';

@UntilDestroy()
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
    combineLatest([this.facade.setMemberName$, this.facade.controlMode$])
      .pipe(untilDestroyed(this))
      .subscribe(([memberName, controlMode]) => {
        const screenTitle =
          controlMode === 'edit' && memberName ? `Edit ${memberName}` : 'Add a member';
        this.metaAndTitleService.updateTitle(screenTitle);
        this.metaAndTitleService.updateDescription(
          `${screenTitle} for the London Chess Club.`,
        );
      });
  }
}
