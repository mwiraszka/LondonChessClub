import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { MetaAndTitleService } from '@app/services';
import { ControlModes } from '@app/types';

import { MemberEditorFacade } from './member-editor.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-member-editor',
  templateUrl: './member-editor.component.html',
  styleUrls: ['./member-editor.component.scss'],
  providers: [MemberEditorFacade],
})
export class MemberEditorComponent implements OnInit {
  readonly ControlModes = ControlModes;
  constructor(
    public facade: MemberEditorFacade,
    private metaAndTitleService: MetaAndTitleService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.facade.selectedMemberName$, this.facade.controlMode$])
      .pipe(untilDestroyed(this))
      .subscribe(([memberName, controlMode]) => {
        const screenTitle =
          controlMode === ControlModes.EDIT && memberName
            ? `Edit ${memberName}`
            : 'Add a member';
        this.metaAndTitleService.updateTitle(screenTitle);
        this.metaAndTitleService.updateDescription(
          `${screenTitle} for the London Chess Club.`,
        );
      });
  }
}
