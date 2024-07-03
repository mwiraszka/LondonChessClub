import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';

import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, Component, Inject, Input, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';

import { kebabize } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.scss'],
})
export class MarkdownRendererComponent implements OnInit, AfterViewChecked {
  @Input() data?: string;

  constructor(
    private router: Router,
    @Inject(DOCUMENT)
    private _document: Document,
  ) {}

  ngOnInit(): void {
    this.setUpRouterListener();
  }

  ngAfterViewChecked(): void {
    this.wrapMarkdownTables();
    this.addArticleAnchorIds();
  }

  private wrapMarkdownTables(): void {
    const tableElements = this._document.querySelectorAll('markdown table');

    if (tableElements) {
      tableElements.forEach(tableElement => {
        if (!Array.from(tableElement?.classList ?? []).includes('lcc-table')) {
          tableElement.classList.add('lcc-table');

          const wrapperElement = this._document.createElement('div');
          wrapperElement.classList.add('lcc-table-wrapper');
          tableElement?.parentNode?.insertBefore(wrapperElement, tableElement);
          wrapperElement.appendChild(tableElement);
        }
      });
    }
  }

  private addArticleAnchorIds(): void {
    const headerElements = this._document.querySelectorAll(
      'markdown h1, markdown h2, markdown h3, markdown h4, markdown h5, markdown h6',
    );

    if (headerElements) {
      headerElements.forEach(headerElement => {
        const headerTextContent = (
          headerElement.textContent || headerElement.innerHTML
        ).replace(/(<([^>]+)>)/gi, '');
        const kebabizedAnchorName = kebabize(headerTextContent);
        headerElement.setAttribute('id', kebabizedAnchorName);
      });
    }
  }

  private setUpRouterListener(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof Scroll),
        untilDestroyed(this),
      )
      .subscribe(event => this.scrollToAnchor((event as Scroll).anchor!));
  }

  private scrollToAnchor(anchorToScrollTo?: string): void {
    const elementToScrollTo = this._document.getElementById(
      anchorToScrollTo ?? 'app-container',
    );

    if (elementToScrollTo) {
      setTimeout(() => {
        elementToScrollTo.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }, 200);
    }
  }
}
