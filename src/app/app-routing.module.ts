import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnsavedArticleGuard, UnsavedEventGuard, UnsavedMemberGuard } from '@app/guards';
import { AboutScreenComponent } from '@app/screens/about';
import { ArticleEditorScreenComponent } from '@app/screens/article-editor';
import { ArticleViewerScreenComponent } from '@app/screens/article-viewer';
import { ChampionScreenComponent } from '@app/screens/champion';
import { ChangePasswordScreenComponent } from '@app/screens/change-password';
import { EventEditorScreenComponent } from '@app/screens/event-editor';
import { GameArchivesScreenComponent } from '@app/screens/game-archives';
import { HomeScreenComponent } from '@app/screens/home';
import { LoginScreenComponent } from '@app/screens/login';
import { MemberEditorScreenComponent } from '@app/screens/member-editor';
import { MembersScreenComponent } from '@app/screens/members';
import { NewsScreenComponent } from '@app/screens/news';
import { PhotoGalleryScreenComponent } from '@app/screens/photo-gallery';
import { ScheduleScreenComponent } from '@app/screens/schedule';
import { NavPathTypes } from '@app/types';

const routes: Routes = [
  {
    path: NavPathTypes.HOME,
    component: HomeScreenComponent,
    pathMatch: 'full',
  },
  {
    path: NavPathTypes.ABOUT,
    component: AboutScreenComponent,
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
    path: `${NavPathTypes.ARTICLE_VIEW}/:article_id`,
    component: ArticleViewerScreenComponent,
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
    path: NavPathTypes.CITY_CHAMPION,
    component: ChampionScreenComponent,
  },
  {
    path: NavPathTypes.PHOTO_GALLERY,
    component: PhotoGalleryScreenComponent,
  },
  {
    path: NavPathTypes.GAME_ARCHIVES,
    component: GameArchivesScreenComponent,
  },
  {
    path: NavPathTypes.LOGIN,
    component: LoginScreenComponent,
  },
  {
    path: NavPathTypes.LOGOUT,
    redirectTo: NavPathTypes.LOGIN,
  },
  {
    path: NavPathTypes.CHANGE_PASSWORD,
    component: ChangePasswordScreenComponent,
  },
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
