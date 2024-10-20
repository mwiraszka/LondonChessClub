import LichessPgnViewer from 'lichess-pgn-viewer';

import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';

import { Link } from '@app/types';
import { getLichessAnalysisUrl, getPlayerName, getScore } from '@app/utils/pgn-utils';

@Component({
  selector: 'lcc-pgn-viewer',
  styleUrls: ['./pgn-viewer.component.scss'],
  templateUrl: './pgn-viewer.component.html',
})
export class PgnViewerComponent implements OnInit, AfterViewInit {
  viewerId!: string;
  lichessAnalysisBoardLink!: Link;

  @Input() index!: number;
  @Input() label!: string;
  @Input() pgn!: string;

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  ngOnInit(): void {
    this.viewerId = `pgn-viewer--${this.label}--${this.index}`;

    this.lichessAnalysisBoardLink = {
      text: 'Lichess Analysis Board',
      path: getLichessAnalysisUrl(this.pgn),
      icon: 'external-link',
      tooltip: 'Load game in Lichess Analysis Board',
    };
  }

  ngAfterViewInit(): void {
    const container = this._document.getElementById(this.viewerId);

    if (container) {
      const _ = LichessPgnViewer(container, {
        classes: this.viewerId, // Required for query selectors below
        initialPly: 'last',
        orientation: 'white',
        pgn: this.pgn,
        showClocks: false,
      });

      const whiteName = getPlayerName(this.pgn, 'White');
      if (!whiteName) {
        console.error(
          '[LCC] A game with no defined White player was found: \n',
          this.pgn,
        );
        return;
      }

      const blackName = getPlayerName(this.pgn, 'Black');
      if (!blackName) {
        console.error(
          '[LCC] A game with no defined Black player was found: \n',
          this.pgn,
        );
        return;
      }

      const whiteScore = getScore(this.pgn, 'White');
      if (!whiteScore) {
        console.error(
          '[LCC] A game with no valid score for White was found: \n',
          this.pgn,
        );
        return;
      }

      const blackScore = getScore(this.pgn, 'Black');
      if (!blackScore) {
        console.error(
          '[LCC] A game with no valid score for Black was found: \n',
          this.pgn,
        );
        return;
      }

      const whitePlayerElement = this._document.querySelector(
        `.${this.viewerId} .lpv__player--bottom > .lpv__player__person`,
      );
      const blackPlayerElement = this._document.querySelector(
        `.${this.viewerId} .lpv__player--top > .lpv__player__person`,
      );

      whitePlayerElement?.setAttribute('data-name', whiteName);
      whitePlayerElement?.setAttribute('data-score', whiteScore);

      blackPlayerElement?.setAttribute('data-name', blackName);
      blackPlayerElement?.setAttribute('data-score', blackScore);
    }
  }
}
