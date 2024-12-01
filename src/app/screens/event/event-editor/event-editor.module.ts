import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EventFormComponent } from '@app/components/event-form/event-form.component';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { EventEditorComponent } from './event-editor.component';

@NgModule({
  declarations: [EventEditorComponent],
  imports: [CommonModule, EventFormComponent, ScreenHeaderModule],
  exports: [EventEditorComponent],
})
export class EventEditorModule {}
