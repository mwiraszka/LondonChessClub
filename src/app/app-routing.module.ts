import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavPaths } from '@app/core/nav';
import { AboutComponent } from '@app/pages/about';
import { ArticleEditorComponent, ArticleListComponent } from '@app/pages/articles';
import { CityChampionComponent } from '@app/pages/city-champion';
import { HomeComponent } from '@app/pages/home';
import { PhotoGalleryComponent } from '@app/pages/photo-gallery';
import { LoginComponent } from '@app/pages/login';
import { MemberEditorComponent, MemberListComponent } from '@app/pages/members';
import { ScheduleComponent } from '@app/pages/schedule';
import { UnsavedArticleGuard, UnsavedMemberGuard } from '@app/shared/guards';
import { SignUpComponent } from './pages/sign-up';

const routes: Routes = [
  {
    path: NavPaths.HOME,
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: NavPaths.MEMBERS,
    component: MemberListComponent,
  },
  {
    path: NavPaths.MEMBERS_ADD,
    component: MemberEditorComponent,
    canDeactivate: [UnsavedMemberGuard],
  },
  {
    path: `${NavPaths.MEMBERS_EDIT}/:member_id`,
    component: MemberEditorComponent,
    canDeactivate: [UnsavedMemberGuard],
  },
  {
    path: NavPaths.SCHEDULE,
    component: ScheduleComponent,
  },
  {
    path: NavPaths.NEWS,
    component: ArticleListComponent,
  },
  {
    path: NavPaths.NEWS_COMPOSE,
    component: ArticleEditorComponent,
    canDeactivate: [UnsavedArticleGuard],
  },
  {
    path: `${NavPaths.NEWS_EDIT}/:article_id`,
    component: ArticleEditorComponent,
    canDeactivate: [UnsavedArticleGuard],
  },
  {
    path: NavPaths.CITY_CHAMPION,
    component: CityChampionComponent,
  },
  {
    path: NavPaths.PHOTO_GALLERY,
    component: PhotoGalleryComponent,
  },
  {
    path: NavPaths.ABOUT,
    component: AboutComponent,
  },
  {
    path: NavPaths.LOGIN,
    component: LoginComponent,
  },
  {
    path: NavPaths.SIGN_UP,
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
