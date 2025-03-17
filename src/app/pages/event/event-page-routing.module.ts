import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards/auth.guard';
import { UnsavedEventGuard } from '@app/guards/unsaved-event.guard';

import { EventEditorPageComponent } from './event-editor/event-editor-page.component';

const routes: Routes = [
  {
    path: 'add',
    component: EventEditorPageComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedEventGuard],
  },
  {
    path: 'edit/:event_id',
    component: EventEditorPageComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedEventGuard],
  },
  {
    path: '**',
    redirectTo: 'add',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventPageRoutingModule {}
