import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavPathTypes } from '@app/core/nav';
import { AboutScreenComponent } from '@app/screens/about';
import {
  ArticleEditorScreenComponent,
  ArticleListScreenComponent,
} from '@app/screens/articles';
import { ChampionScreenComponent } from '@app/screens/champion';
import { HomeScreenComponent } from '@app/screens/home';
import { PhotoGalleryScreenComponent } from '@app/screens/photo-gallery';
import { LoginScreenComponent } from '@app/screens/login';
import {
  MemberEditorScreenComponent,
  MemberListScreenComponent,
} from '@app/screens/members';
import { SignUpScreenComponent } from '@app/screens/sign-up';
import { UnsavedArticleGuard, UnsavedMemberGuard } from '@app/shared/guards';

import { ScheduleScreenComponent } from '@app/screens/schedule';

const routes: Routes = [
  {
    path: NavPathTypes.HOME,
    component: HomeScreenComponent,
    pathMatch: 'full',
  },
  {
    path: NavPathTypes.MEMBERS,
    component: MemberListScreenComponent,
  },
  {
    path: NavPathTypes.MEMBERS_ADD,
    component: MemberEditorScreenComponent,
    canDeactivate: [UnsavedMemberGuard],
  },
  {
    path: `${NavPathTypes.MEMBERS_EDIT}/:member_id`,
    component: MemberEditorScreenComponent,
    canDeactivate: [UnsavedMemberGuard],
  },
  {
    path: NavPathTypes.SCHEDULE,
    component: ScheduleScreenComponent,
  },
  {
    path: NavPathTypes.NEWS,
    component: ArticleListScreenComponent,
  },
  {
    path: NavPathTypes.NEWS_COMPOSE,
    component: ArticleEditorScreenComponent,
    canDeactivate: [UnsavedArticleGuard],
  },
  {
    path: `${NavPathTypes.NEWS_EDIT}/:article_id`,
    component: ArticleEditorScreenComponent,
    canDeactivate: [UnsavedArticleGuard],
  },
  {
    path: NavPathTypes.LONDON_CHESS_CHAMPION,
    component: ChampionScreenComponent,
  },
  {
    path: NavPathTypes.PHOTO_GALLERY,
    component: PhotoGalleryScreenComponent,
  },
  {
    path: NavPathTypes.ABOUT,
    component: AboutScreenComponent,
  },
  {
    path: NavPathTypes.LOGIN,
    component: LoginScreenComponent,
  },
  {
    path: NavPathTypes.SIGN_UP,
    component: SignUpScreenComponent,
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
