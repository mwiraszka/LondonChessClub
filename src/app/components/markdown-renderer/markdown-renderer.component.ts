/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, Component, Inject, Input, OnInit } from '@angular/core';

import { kebabize } from '@app/utils';

import { MarkdownRendererFacade } from './markdown-renderer.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.scss'],
  providers: [MarkdownRendererFacade],
})
export class MarkdownRendererComponent implements OnInit, AfterViewChecked {
  @Input() data?: string;

  constructor(
    public facade: MarkdownRendererFacade,
    @Inject(DOCUMENT) private _document: Document,
  ) {}

  ngOnInit(): void {
    this.facade.sectionToScrollTo$
      .pipe(untilDestroyed(this))
      .subscribe(sectionToScrollTo => {
        setTimeout(() => {
          if (sectionToScrollTo) {
            this.scrollToArticleSection(sectionToScrollTo);
          }
        }, 100);
      });
  }

  ngAfterViewChecked(): void {
    this.wrapMarkdownTables();
    this.addSectionClasses();
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

  private addSectionClasses(): void {
    const headerElements = this._document.querySelectorAll(
      'markdown h1, markdown h2, markdown h3, markdown h4, markdown h5, markdown h6',
    );

    if (headerElements) {
      headerElements.forEach(headerElement => {
        const kebabizedSectionName = kebabize(headerElement.innerHTML);
        headerElement.classList.add(`lcc-section-${kebabizedSectionName}`);
      });
    }
  }

  private scrollToArticleSection(sectionToScrollTo: string): void {
    this.facade.onScrollToSection();
    const sectionElement = this._document.getElementsByClassName(
      `lcc-section-${sectionToScrollTo}`,
    )[0];

    if (sectionElement) {
      sectionElement.scrollIntoView({
        behavior: 'instant',
        block: 'start',
        inline: 'nearest',
      });
    }
  }
}
