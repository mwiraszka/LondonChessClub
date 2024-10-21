import { BaseChartDirective } from 'ng2-charts';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ExpansionPanelModule } from '@app/components/expansion-panel';
import { PgnViewerModule } from '@app/components/pgn-viewer';
import { ScreenHeaderModule } from '@app/components/screen-header';
import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';

import { GameArchivesScreenRoutingModule } from './game-archives-screen-routing.module';
import { GameArchivesScreenComponent } from './game-archives-screen.component';

@NgModule({
  declarations: [GameArchivesScreenComponent],
  imports: [
    BaseChartDirective,
    CommonModule,
    ExpansionPanelModule,
    GameArchivesScreenRoutingModule,
    IconsModule,
    PgnViewerModule,
    ReactiveFormsModule,
    ScreenHeaderModule,
    ScrollingModule,
    TooltipModule,
  ],
})
export class GameArchivesScreenModule {}
