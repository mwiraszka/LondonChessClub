import { UntilDestroy } from '@ngneat/until-destroy';
import { kebabCase } from 'lodash';
import { MarkdownComponent } from 'ngx-markdown';

import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TableOfContentsComponent } from '@app/components/table-of-contents/table-of-contents.component';

@UntilDestroy()
@Component({
  selector: 'lcc-markdown-renderer',
  template: `
    @if (subheadings.length) {
      <lcc-table-of-contents [subheadings]="subheadings"></lcc-table-of-contents>
    }
    <markdown [data]="data"></markdown>
  `,
  styleUrl: './markdown-renderer.component.scss',
  imports: [CommonModule, MarkdownComponent, TableOfContentsComponent],
})
export class MarkdownRendererComponent implements OnChanges {
  @Input() public data?: string;

  public subheadings: string[] = [];

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      setTimeout(() => {
        this.wrapMarkdownTables();
        this.addAnchorIdsToSubheadings();
      });
    }
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

  private addAnchorIdsToSubheadings(): void {
    const subheadingElements = this._document.querySelectorAll('markdown h2');

    const newSubheadings: string[] = [];

    if (subheadingElements) {
      subheadingElements.forEach(element => {
        const subheading = (element.textContent || element.innerHTML).replace(
          /(<([^>]+)>)/gi,
          '',
        );

        element.setAttribute('id', kebabCase(subheading));
        newSubheadings.push(subheading);
      });
    }

    this.subheadings = newSubheadings;
  }
}
