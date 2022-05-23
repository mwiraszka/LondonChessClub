import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AboutModule } from '@app/pages/about';
import { ArticleEditorModule, ArticleListModule } from '@app/pages/articles';
import { CityChampionModule } from '@app/pages/city-champion';
import { HomeModule } from '@app/pages/home';
import { LoginModule } from '@app/pages/login';
import { PhotoGalleryModule } from '@app/pages/photo-gallery';
import { MemberEditorModule, MemberListModule } from '@app/pages/members';
import { ScheduleModule } from '@app/pages/schedule';
import { SignUpModule } from '@app/pages/sign-up';

const modules = [
  AboutModule,
  ArticleEditorModule,
  ArticleListModule,
  CityChampionModule,
  HomeModule,
  LoginModule,
  PhotoGalleryModule,
  MemberEditorModule,
  MemberListModule,
  ScheduleModule,
  SignUpModule,
];

@NgModule({
  imports: [CommonModule, modules],
  exports: [modules],
})
export class PagesModule {}
