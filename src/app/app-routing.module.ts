import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards';
import { NavPathTypes } from '@app/types';

const routes: Routes = [
  {
    path: NavPathTypes.HOME,
    loadChildren: () =>
      import('./screens/home/home-screen.module').then((m) => m.HomeScreenModule),
    pathMatch: 'full',
  },
  {
    path: NavPathTypes.ABOUT,
    loadChildren: () =>
      import('./screens/about/about-screen.module').then((m) => m.AboutScreenModule),
  },
  {
    path: NavPathTypes.MEMBERS,
    loadChildren: () =>
      import('./screens/members/members-screen.module').then(
        (m) => m.MembersScreenModule,
      ),
  },
  {
    path: NavPathTypes.MEMBER,
    loadChildren: () =>
      import('./screens/member/member-screen.module').then((m) => m.MemberScreenModule),
  },
  {
    path: NavPathTypes.SCHEDULE,
    loadChildren: () =>
      import('./screens/schedule/schedule-screen.module').then(
        (m) => m.ScheduleScreenModule,
      ),
  },
  {
    path: NavPathTypes.EVENT,
    loadChildren: () =>
      import('./screens/event/event-screen.module').then((m) => m.EventScreenModule),
    canActivate: [AuthGuard],
  },
  {
    path: NavPathTypes.NEWS,
    loadChildren: () =>
      import('./screens/news/news-screen.module').then((m) => m.NewsScreenModule),
  },
  {
    path: NavPathTypes.ARTICLE,
    loadChildren: () =>
      import('./screens/article/article-screen.module').then(
        (m) => m.ArticleScreenModule,
      ),
  },
  {
    path: NavPathTypes.CITY_CHAMPION,
    loadChildren: () =>
      import('./screens/champion/champion-screen.module').then(
        (m) => m.ChampionScreenModule,
      ),
  },
  {
    path: NavPathTypes.PHOTO_GALLERY,
    loadChildren: () =>
      import('./screens/photo-gallery/photo-gallery-screen.module').then(
        (m) => m.PhotoGalleryScreenModule,
      ),
  },
  {
    path: NavPathTypes.GAME_ARCHIVES,
    loadChildren: () =>
      import('./screens/game-archives/game-archives-screen.module').then(
        (m) => m.GameArchivesScreenModule,
      ),
  },
  {
    path: NavPathTypes.DOCUMENTS,
    loadChildren: () =>
      import('./screens/documents/documents-screen.module').then(
        (m) => m.DocumentsScreenModule,
      ),
  },
  {
    path: NavPathTypes.LOGIN,
    loadChildren: () =>
      import('./screens/login/login-screen.module').then((m) => m.LoginScreenModule),
  },
  {
    path: NavPathTypes.LOGOUT,
    redirectTo: NavPathTypes.LOGIN,
  },
  {
    path: NavPathTypes.CHANGE_PASSWORD,
    loadChildren: () =>
      import('./screens/change-password/change-password-screen.module').then(
        (m) => m.ChangePasswordScreenModule,
      ),
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
