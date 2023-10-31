import { Component } from '@angular/core';

import { Link, NavPathTypes } from '@app/types';

import { ArticleEditorScreenFacade } from './article-editor-screen.facade';

@Component({
  selector: 'lcc-article-editor-screen',
  templateUrl: './article-editor-screen.component.html',
  styleUrls: ['./article-editor-screen.component.scss'],
  providers: [ArticleEditorScreenFacade],
})
export class ArticleEditorScreenComponent {
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

  constructor(public facade: ArticleEditorScreenFacade) {}
}
