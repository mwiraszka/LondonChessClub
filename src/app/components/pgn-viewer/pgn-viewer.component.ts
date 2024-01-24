import LichessPgnViewer from 'lichess-pgn-viewer';

import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lcc-pgn-viewer',
  templateUrl: './pgn-viewer.component.html',
  styleUrls: ['./pgn-viewer.component.scss'],
})
export class PgnViewerComponent implements OnInit {
  @Input() pgn?: string;
  container!: HTMLElement | null;

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  ngOnInit(): void {
    this.container = this._document.getElementById('pgnViewer');
    if (this.container) {
      const pgnViewer = LichessPgnViewer(this.container, { pgn: this.pgn });
    }
  }
}
