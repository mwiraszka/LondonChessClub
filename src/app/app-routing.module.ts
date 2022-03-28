import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavPaths } from '@app/core/nav';
import { AboutComponent } from '@app/pages/about';
import { ArticleEditorComponent, ArticleListComponent } from '@app/pages/articles';
import { CityChampionComponent } from '@app/pages/city-champion';
import { HomeComponent } from '@app/pages/home';
import { LessonsComponent } from '@app/pages/lessons';
import { LoginComponent } from '@app/pages/login';
import { MemberEditorComponent, MemberListComponent } from '@app/pages/members';
import { ScheduleComponent } from '@app/pages/schedule';
import { SuppliesComponent } from '@app/pages/supplies';
import { UnsavedGuard } from '@app/shared/guards';

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
    canDeactivate: [UnsavedGuard],
  },
  {
    path: NavPaths.MEMBERS_EDIT,
    component: MemberEditorComponent,
    canDeactivate: [UnsavedGuard],
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
    canDeactivate: [UnsavedGuard],
  },
  {
    path: NavPaths.NEWS_EDIT,
    component: ArticleEditorComponent,
    canDeactivate: [UnsavedGuard],
  },
  {
    path: NavPaths.CITY_CHAMPION,
    component: CityChampionComponent,
  },
  {
    path: NavPaths.LESSONS,
    component: LessonsComponent,
  },
  {
    path: NavPaths.SUPPLIES,
    component: SuppliesComponent,
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
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
