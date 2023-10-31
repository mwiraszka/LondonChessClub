import { Component, Input } from '@angular/core';

import { Article, Link, NavPathTypes } from '@app/types';

import { ArticleViewerScreenFacade } from './article-viewer-screen.facade';

@Component({
  selector: 'lcc-article-viewer-screen',
  templateUrl: './article-viewer-screen.component.html',
  styleUrls: ['./article-viewer-screen.component.scss'],
  providers: [ArticleViewerScreenFacade],
})
export class ArticleViewerScreenComponent {
  @Input() article?: Article;

  links: Link[] = [
    {
      path: NavPathTypes.NEWS,
      text: 'Return to articles',
    },
    {
      path: NavPathTypes.HOME,
      text: 'Return to home page',
    },
  ];

  constructor(public facade: ArticleViewerScreenFacade) {}
}