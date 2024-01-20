import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AboutScreenModule } from './about';
import { ArticleEditorScreenModule } from './article-editor';
import { ArticleViewerScreenModule } from './article-viewer';
import { ChampionScreenModule } from './champion';
import { EventEditorScreenModule } from './event-editor';
import { GameArchivesScreenModule } from './game-archives';
import { HomeScreenModule } from './home';
import { LoginScreenModule } from './login';
import { MemberEditorScreenModule } from './member-editor';
import { MembersScreenModule } from './members';
import { NewsScreenModule } from './news';
import { PhotoGalleryScreenModule } from './photo-gallery';
import { ScheduleScreenModule } from './schedule';

const modules = [
  AboutScreenModule,
  ArticleEditorScreenModule,
  ArticleViewerScreenModule,
  ChampionScreenModule,
  EventEditorScreenModule,
  GameArchivesScreenModule,
  HomeScreenModule,
  LoginScreenModule,
  MemberEditorScreenModule,
  MembersScreenModule,
  NewsScreenModule,
  PhotoGalleryScreenModule,
  ScheduleScreenModule,
];

@NgModule({
  imports: [CommonModule, modules],
  exports: [modules],
})
export class ScreensModule {}
