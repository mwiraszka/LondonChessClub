import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavPathTypes } from '@app/core/nav';
import { AboutComponent } from '@app/pages/about';
import { ArticleEditorComponent, ArticleListComponent } from '@app/pages/articles';
import { LondonChessChampionComponent } from '@app/pages/london-chess-champion';
import { HomeComponent } from '@app/pages/home';
import { PhotoGalleryComponent } from '@app/pages/photo-gallery';
import { LoginComponent } from '@app/pages/login';
import { MemberEditorComponent, MemberListComponent } from '@app/pages/members';
import { SchedulePageComponent } from '@app/pages/schedule';
import { UnsavedArticleGuard, UnsavedMemberGuard } from '@app/shared/guards';
import { SignUpComponent } from './pages/sign-up';

const routes: Routes = [
  {
    path: NavPathTypes.HOME,
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: NavPathTypes.MEMBERS,
    component: MemberListComponent,
  },
  {
    path: NavPathTypes.MEMBERS_ADD,
    component: MemberEditorComponent,
    canDeactivate: [UnsavedMemberGuard],
  },
  {
    path: `${NavPathTypes.MEMBERS_EDIT}/:member_id`,
    component: MemberEditorComponent,
    canDeactivate: [UnsavedMemberGuard],
  },
  {
    path: NavPathTypes.SCHEDULE,
    component: SchedulePageComponent,
  },
  {
    path: NavPathTypes.NEWS,
    component: ArticleListComponent,
  },
  {
    path: NavPathTypes.NEWS_COMPOSE,
    component: ArticleEditorComponent,
    canDeactivate: [UnsavedArticleGuard],
  },
  {
    path: `${NavPathTypes.NEWS_EDIT}/:article_id`,
    component: ArticleEditorComponent,
    canDeactivate: [UnsavedArticleGuard],
  },
  {
    path: NavPathTypes.LONDON_CHESS_CHAMPION,
    component: LondonChessChampionComponent,
  },
  {
    path: NavPathTypes.PHOTO_GALLERY,
    component: PhotoGalleryComponent,
  },
  {
    path: NavPathTypes.ABOUT,
    component: AboutComponent,
  },
  {
    path: NavPathTypes.LOGIN,
    component: LoginComponent,
  },
  {
    path: NavPathTypes.SIGN_UP,
    component: SignUpComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
