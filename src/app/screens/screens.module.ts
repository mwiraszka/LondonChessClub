import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AboutScreenModule } from '@app/screens/about';
import {
  ArticleEditorScreenModule,
  ArticleListScreenModule,
} from '@app/screens/articles';
import { ChampionScreenModule } from '@app/screens/champion';
import { HomeScreenModule } from '@app/screens/home';
import { LoginScreenModule } from '@app/screens/login';
import { PhotoGalleryScreenModule } from '@app/screens/photo-gallery';
import { MemberEditorScreenModule, MemberListScreenModule } from '@app/screens/members';
import { ScheduleScreenModule } from '@app/screens/schedule';
import { SignUpScreenModule } from '@app/screens/sign-up';

const modules = [
  AboutScreenModule,
  ArticleEditorScreenModule,
  ArticleListScreenModule,
  ChampionScreenModule,
  HomeScreenModule,
  LoginScreenModule,
  PhotoGalleryScreenModule,
  MemberEditorScreenModule,
  MemberListScreenModule,
  ScheduleScreenModule,
  SignUpScreenModule,
];

@NgModule({
  imports: [CommonModule, modules],
  exports: [modules],
})
export class ScreensModule {}
