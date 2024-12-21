import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards/auth.guard';
import { NavPathTypes } from '@app/types';

const routes: Routes = [
  {
    path: NavPathTypes.HOME,
    loadChildren: () =>
      import('./screens/home/home-screen-routing.module').then(
        m => m.HomeScreenRoutingModule,
      ),
    pathMatch: 'full',
  },
  {
    path: NavPathTypes.ABOUT,
    loadChildren: () =>
      import('./screens/about/about-screen-routing.module').then(
        m => m.AboutScreenRoutingModule,
      ),
  },
  {
    path: NavPathTypes.MEMBERS,
    loadChildren: () =>
      import('./screens/members/members-screen-routing.module').then(
        m => m.MembersScreenRoutingModule,
      ),
  },
  {
    path: NavPathTypes.MEMBER,
    loadChildren: () =>
      import('./screens/member/member-screen-routing.module').then(
        m => m.MemberScreenRoutingModule,
      ),
  },
  {
    path: NavPathTypes.SCHEDULE,
    loadChildren: () =>
      import('./screens/schedule/schedule-screen-routing.module').then(
        m => m.ScheduleScreenRoutingModule,
      ),
  },
  {
    path: NavPathTypes.EVENT,
    loadChildren: () =>
      import('./screens/event/event-screen-routing.module').then(
        m => m.EventScreenRoutingModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: NavPathTypes.NEWS,
    loadChildren: () =>
      import('./screens/news/news-screen-routing.module').then(
        m => m.NewsScreenRoutingModule,
      ),
  },
  {
    path: NavPathTypes.ARTICLE,
    loadChildren: () =>
      import('./screens/article/article-screen-routing.module').then(
        m => m.ArticleScreenRoutingModule,
      ),
  },
  {
    path: NavPathTypes.CITY_CHAMPION,
    loadChildren: () =>
      import('./screens/champion/champion-screen-routing.module').then(
        m => m.ChampionScreenRoutingModule,
      ),
  },
  {
    path: NavPathTypes.PHOTO_GALLERY,
    loadChildren: () =>
      import('./screens/photo-gallery/photo-gallery-screen-routing.module').then(
        m => m.PhotoGalleryScreenRoutingModule,
      ),
  },
  {
    path: NavPathTypes.GAME_ARCHIVES,
    loadChildren: () =>
      import('./screens/game-archives/game-archives-screen-routing.module').then(
        m => m.GameArchivesScreenRoutingModule,
      ),
  },
  {
    path: NavPathTypes.DOCUMENTS,
    loadChildren: () =>
      import('./screens/documents/documents-screen-routing.module').then(
        m => m.DocumentsScreenRoutingModule,
      ),
  },
  {
    path: NavPathTypes.LOGIN,
    loadChildren: () =>
      import('./screens/login/login-screen-routing.module').then(
        m => m.LoginScreenRoutingModule,
      ),
  },
  {
    path: NavPathTypes.LOGOUT,
    redirectTo: NavPathTypes.LOGIN,
  },
  {
    path: NavPathTypes.CHANGE_PASSWORD,
    loadChildren: () =>
      import('./screens/change-password/change-password-screen-routing.module').then(
        m => m.ChangePasswordScreenRoutingModule,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
