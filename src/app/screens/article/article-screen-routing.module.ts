import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards/auth.guard';
import { UnsavedArticleGuard } from '@app/guards/unsaved-article.guard';
import { NavPathTypes } from '@app/types';

import { ArticleEditorScreenComponent } from './article-editor/article-editor-screen.component';
import { ArticleViewerScreenComponent } from './article-viewer/article-viewer-screen.component';

const routes: Routes = [
  {
    path: `${NavPathTypes.VIEW}/:article_id`,
    component: ArticleViewerScreenComponent,
  },
  {
    path: NavPathTypes.ADD,
    component: ArticleEditorScreenComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedArticleGuard],
  },
  {
    path: `${NavPathTypes.EDIT}/:article_id`,
    component: ArticleEditorScreenComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedArticleGuard],
  },
  {
    path: '**',
    redirectTo: NavPathTypes.VIEW,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticleScreenRoutingModule {}
