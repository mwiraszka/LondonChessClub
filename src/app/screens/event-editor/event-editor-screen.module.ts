import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EventFormModule } from '@app/components/event-form';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { EventEditorScreenComponent } from './event-editor-screen.component';

@NgModule({
  declarations: [EventEditorScreenComponent],
  imports: [CommonModule, EventFormModule, ScreenHeaderModule],
  exports: [EventEditorScreenComponent],
})
export class EventEditorScreenModule {}
