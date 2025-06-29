import LichessPgnViewer from 'lichess-pgn-viewer';

import { AfterViewInit, Component, DOCUMENT, Inject, Input, OnInit } from '@angular/core';

import { LinkListComponent } from '@app/components/link-list/link-list.component';
import type { ExternalLink } from '@app/models';
import { getLichessAnalysisUrl, getPlayerName, getScore } from '@app/utils';

@Component({
  selector: 'lcc-pgn-viewer',
  template: `
    <div [id]="viewerId"></div>
    <lcc-link-list [links]="[lichessAnalysisBoardLink]"></lcc-link-list>
  `,
  styles: `
    lcc-link-list {
      margin-top: 4px;
    }
  `,
  imports: [LinkListComponent],
})
export class PgnViewerComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) public index!: number;
  @Input({ required: true }) public label!: string;
  @Input({ required: true }) public pgn!: string;

  public lichessAnalysisBoardLink!: ExternalLink;
  public viewerId!: string;

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  ngOnInit(): void {
    this.viewerId = `pgn-viewer--${this.label}--${this.index}`;

    this.lichessAnalysisBoardLink = {
      text: 'Analyze game on Lichess',
      externalPath: getLichessAnalysisUrl(this.pgn),
      icon: 'book-open',
    };
  }

  ngAfterViewInit(): void {
    const container = this._document.getElementById(this.viewerId);

    if (container) {
      LichessPgnViewer(container, {
        classes: this.viewerId, // Required for query selectors below
        initialPly: 'last',
        orientation: 'white',
        pgn: this.pgn,
        showClocks: false,
      });

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

      const whiteName = getPlayerName(this.pgn, 'full', 'White');
      if (!whiteName) {
        console.error(
          '[LCC] A game with no defined White player was found: \n',
          this.pgn,
        );
        return;
      }

      const blackName = getPlayerName(this.pgn, 'full', 'Black');
      if (!blackName) {
        console.error(
          '[LCC] A game with no defined Black player was found: \n',
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
