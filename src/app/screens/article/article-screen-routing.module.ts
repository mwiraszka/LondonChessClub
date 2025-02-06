import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards/auth.guard';
import { UnsavedArticleGuard } from '@app/guards/unsaved-article.guard';

import { ArticleEditorScreenComponent } from './article-editor/article-editor-screen.component';
import { ArticleViewerScreenComponent } from './article-viewer/article-viewer-screen.component';

const routes: Routes = [
  {
    path: 'view/:article_id',
    component: ArticleViewerScreenComponent,
  },
  {
    path: 'add',
    component: ArticleEditorScreenComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedArticleGuard],
  },
  {
    path: 'edit/:article_id',
    component: ArticleEditorScreenComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedArticleGuard],
  },
  {
    path: '**',
    redirectTo: 'view',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticleScreenRoutingModule {}
