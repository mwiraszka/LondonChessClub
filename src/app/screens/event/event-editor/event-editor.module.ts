import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EventFormModule } from '@app/components/event-form';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { EventEditorComponent } from './event-editor.component';

@NgModule({
  declarations: [EventEditorComponent],
  imports: [CommonModule, EventFormModule, ScreenHeaderModule],
  exports: [EventEditorComponent],
})
export class EventEditorModule {}
