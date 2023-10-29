import { Component, Input } from '@angular/core';

import { Article } from '@app/types';

import { ArticleViewerScreenFacade } from './article-viewer-screen.facade';

@Component({
  selector: 'lcc-article-viewer-screen',
  templateUrl: './article-viewer-screen.component.html',
  styleUrls: ['./article-viewer-screen.component.scss'],
  providers: [ArticleViewerScreenFacade],
})
export class ArticleViewerScreenComponent {
  @Input() article?: Article;

  constructor(public facade: ArticleViewerScreenFacade) {}
}
