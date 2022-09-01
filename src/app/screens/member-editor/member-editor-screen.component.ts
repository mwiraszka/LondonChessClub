import { Component } from '@angular/core';

import { MemberEditorScreenFacade } from './member-editor-screen.facade';

@Component({
  selector: 'lcc-member-editor-screen',
  templateUrl: './member-editor-screen.component.html',
  styleUrls: ['./member-editor-screen.component.scss'],
  providers: [MemberEditorScreenFacade],
})
export class MemberEditorScreenComponent {
  constructor(public facade: MemberEditorScreenFacade) {}
}
