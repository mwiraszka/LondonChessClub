import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./screens/home/home-screen-routing.module').then(
        m => m.HomeScreenRoutingModule,
      ),
    pathMatch: 'full',
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./screens/about/about-screen-routing.module').then(
        m => m.AboutScreenRoutingModule,
      ),
  },
  {
    path: 'members',
    loadChildren: () =>
      import('./screens/members/members-screen-routing.module').then(
        m => m.MembersScreenRoutingModule,
      ),
  },
  {
    path: 'member',
    loadChildren: () =>
      import('./screens/member/member-screen-routing.module').then(
        m => m.MemberScreenRoutingModule,
      ),
  },
  {
    path: 'schedule',
    loadChildren: () =>
      import('./screens/schedule/schedule-screen-routing.module').then(
        m => m.ScheduleScreenRoutingModule,
      ),
  },
  {
    path: 'event',
    loadChildren: () =>
      import('./screens/event/event-screen-routing.module').then(
        m => m.EventScreenRoutingModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'news',
    loadChildren: () =>
      import('./screens/news/news-screen-routing.module').then(
        m => m.NewsScreenRoutingModule,
      ),
  },
  {
    path: 'article',
    loadChildren: () =>
      import('./screens/article/article-screen-routing.module').then(
        m => m.ArticleScreenRoutingModule,
      ),
  },
  {
    path: 'city-champion',
    loadChildren: () =>
      import('./screens/champion/champion-screen-routing.module').then(
        m => m.ChampionScreenRoutingModule,
      ),
  },
  {
    path: 'photo-gallery',
    loadChildren: () =>
      import('./screens/photo-gallery/photo-gallery-screen-routing.module').then(
        m => m.PhotoGalleryScreenRoutingModule,
      ),
  },
  {
    path: 'game-archives',
    loadChildren: () =>
      import('./screens/game-archives/game-archives-screen-routing.module').then(
        m => m.GameArchivesScreenRoutingModule,
      ),
  },
  {
    path: 'documents',
    loadChildren: () =>
      import('./screens/documents/documents-screen-routing.module').then(
        m => m.DocumentsScreenRoutingModule,
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./screens/login/login-screen-routing.module').then(
        m => m.LoginScreenRoutingModule,
      ),
  },
  {
    path: 'logout',
    redirectTo: 'login',
  },
  {
    path: 'change-password',
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
