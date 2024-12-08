import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards/auth.guard';
import { UnsavedArticleGuard } from '@app/guards/unsaved-article.guard';
import { NavPathTypes } from '@app/types';

import { ArticleEditorComponent } from './article-editor/article-editor.component';
import { ArticleViewerComponent } from './article-viewer/article-viewer.component';

const routes: Routes = [
  {
    path: `${NavPathTypes.VIEW}/:article_id`,
    component: ArticleViewerComponent,
  },
  {
    path: NavPathTypes.ADD,
    component: ArticleEditorComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedArticleGuard],
  },
  {
    path: `${NavPathTypes.EDIT}/:article_id`,
    component: ArticleEditorComponent,
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
