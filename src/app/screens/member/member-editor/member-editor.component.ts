import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MemberFormComponent } from '@app/components/member-form/member-form.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';

import { MemberEditorFacade } from './member-editor.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-member-editor',
  templateUrl: './member-editor.component.html',
  styleUrls: ['./member-editor.component.scss'],
  providers: [MemberEditorFacade],
  imports: [CommonModule, MemberFormComponent, ScreenHeaderComponent],
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
