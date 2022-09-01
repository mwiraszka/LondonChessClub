import { Component } from '@angular/core';

import { EventEditorScreenFacade } from './event-editor-screen.facade';

@Component({
  selector: 'lcc-event-editor-screen',
  templateUrl: './event-editor-screen.component.html',
  styleUrls: ['./event-editor-screen.component.scss'],
  providers: [EventEditorScreenFacade],
})
export class EventEditorScreenComponent {
  constructor(public facade: EventEditorScreenFacade) {}
}
