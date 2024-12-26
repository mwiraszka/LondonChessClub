import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards/auth.guard';
import { UnsavedMemberGuard } from '@app/guards/unsaved-member.guard';

import { MemberEditorScreenComponent } from './member-editor/member-editor-screen.component';

const routes: Routes = [
  {
    path: 'add',
    component: MemberEditorScreenComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedMemberGuard],
  },
  {
    path: 'edit/:member_id',
    component: MemberEditorScreenComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedMemberGuard],
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
export class MemberScreenRoutingModule {}
