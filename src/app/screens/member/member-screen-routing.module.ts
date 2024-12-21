import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards/auth.guard';
import { UnsavedMemberGuard } from '@app/guards/unsaved-member.guard';
import { NavPathTypes } from '@app/types';

import { MemberEditorScreenComponent } from './member-editor/member-editor-screen.component';

const routes: Routes = [
  {
    path: NavPathTypes.ADD,
    component: MemberEditorScreenComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedMemberGuard],
  },
  {
    path: `${NavPathTypes.EDIT}/:member_id`,
    component: MemberEditorScreenComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedMemberGuard],
  },
  {
    path: '**',
    redirectTo: NavPathTypes.ADD,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberScreenRoutingModule {}
