import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AboutModule } from '@app/pages/about';
import { ArticleEditorModule, ArticleListModule } from '@app/pages/articles';
import { CityChampionModule } from '@app/pages/city-champion';
import { HomeModule } from '@app/pages/home';
import { LessonsModule } from '@app/pages/lessons';
import { LoginModule } from '@app/pages/login';
import { MemberEditorModule, MemberListModule } from '@app/pages/members';
import { ScheduleModule } from '@app/pages/schedule';
import { SignUpModule } from '@app/pages/sign-up';
import { SuppliesModule } from '@app/pages/supplies';

const modules = [
  AboutModule,
  ArticleEditorModule,
  ArticleListModule,
  CityChampionModule,
  HomeModule,
  LessonsModule,
  LoginModule,
  MemberEditorModule,
  MemberListModule,
  ScheduleModule,
  SignUpModule,
  SuppliesModule,
];

@NgModule({
  imports: [CommonModule, modules],
  exports: [modules],
})
export class PagesModule {}
