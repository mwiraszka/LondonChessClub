import LichessPgnViewer from 'lichess-pgn-viewer';

import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, Input } from '@angular/core';

@Component({
  selector: 'lcc-pgn-viewer',
  templateUrl: './pgn-viewer.component.html',
  styleUrls: ['./pgn-viewer.component.scss'],
})
export class PgnViewerComponent implements AfterViewInit {
  @Input() pgn?: string;
  @Input() index!: number;

  container: HTMLElement | null = null;

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  ngAfterViewInit(): void {
    this.container = this._document.getElementById(`pgn-viewer-${this.index}`);
    if (this.container) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = LichessPgnViewer(this.container, { pgn: this.pgn });
    }
  }
}
