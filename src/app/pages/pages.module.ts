import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AboutModule } from '@app/pages/about';
import { ArticleEditorModule, ArticleListModule } from '@app/pages/articles';
import { LondonChessChampionModule } from '@app/pages/london-chess-champion';
import { HomeModule } from '@app/pages/home';
import { LoginModule } from '@app/pages/login';
import { PhotoGalleryModule } from '@app/pages/photo-gallery';
import { MemberEditorModule, MemberListModule } from '@app/pages/members';
import { SchedulePageModule } from '@app/pages/schedule';
import { SignUpModule } from '@app/pages/sign-up';

const modules = [
  AboutModule,
  ArticleEditorModule,
  ArticleListModule,
  LondonChessChampionModule,
  HomeModule,
  LoginModule,
  PhotoGalleryModule,
  MemberEditorModule,
  MemberListModule,
  SchedulePageModule,
  SignUpModule,
];

@NgModule({
  imports: [CommonModule, modules],
  exports: [modules],
})
export class PagesModule {}
