import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnsavedArticleGuard, UnsavedEventGuard, UnsavedMemberGuard } from '@app/guards';
import { AboutScreenComponent } from '@app/screens/about';
import { ArticleEditorScreenComponent } from '@app/screens/article-editor';
import { ChampionScreenComponent } from '@app/screens/champion';
import { ChangePasswordScreenComponent } from '@app/screens/change-password';
import { EventEditorScreenComponent } from '@app/screens/event-editor';
import { HomeScreenComponent } from '@app/screens/home';
import { PhotoGalleryScreenComponent } from '@app/screens/photo-gallery';
import { LoginScreenComponent } from '@app/screens/login';
import { MemberEditorScreenComponent } from '@app/screens/member-editor';
import { MembersScreenComponent } from '@app/screens/members';
import { NewsScreenComponent } from '@app/screens/news';
import { ScheduleScreenComponent } from '@app/screens/schedule';
import { SignUpScreenComponent } from '@app/screens/sign-up';
import { NavPathTypes } from '@app/types';

const routes: Routes = [
  {
    path: NavPathTypes.HOME,
    component: HomeScreenComponent,
    pathMatch: 'full',
  },
  {
    path: NavPathTypes.MEMBERS,
    component: MembersScreenComponent,
  },
  {
    path: NavPathTypes.MEMBER_ADD,
    component: MemberEditorScreenComponent,
    canDeactivate: [UnsavedMemberGuard],
  },
  {
    path: `${NavPathTypes.MEMBER_EDIT}/:member_id`,
    component: MemberEditorScreenComponent,
    canDeactivate: [UnsavedMemberGuard],
  },
  {
    path: NavPathTypes.SCHEDULE,
    component: ScheduleScreenComponent,
  },
  {
    path: NavPathTypes.EVENT_ADD,
    component: EventEditorScreenComponent,
    canDeactivate: [UnsavedEventGuard],
  },
  {
    path: `${NavPathTypes.EVENT_EDIT}/:event_id`,
    component: EventEditorScreenComponent,
    canDeactivate: [UnsavedEventGuard],
  },
  {
    path: NavPathTypes.NEWS,
    component: NewsScreenComponent,
  },
  {
    path: NavPathTypes.ARTICLE_ADD,
    component: ArticleEditorScreenComponent,
    canDeactivate: [UnsavedArticleGuard],
  },
  {
    path: `${NavPathTypes.ARTICLE_EDIT}/:article_id`,
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
    path: NavPathTypes.CHANGE_PASSWORD,
    component: ChangePasswordScreenComponent,
  },
  // temporarily removed to prevent unauthorized access
  // {
  //   path: NavPathTypes.SIGN_UP,
  //   component: SignUpScreenComponent,
  // },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
