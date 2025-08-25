import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { kebabCase } from 'lodash';
import { MarkdownComponent } from 'ngx-markdown';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  Inject,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgChanges } from '@app/models';
import { KebabCasePipe } from '@app/pipes';
import { RoutingService } from '@app/services';

@UntilDestroy()
@Component({
  selector: 'lcc-markdown-renderer',
  template: `
    <div class="table-of-contents">
      @for (heading of headings; track heading) {
        <a
          class="heading-link lcc-link"
          [fragment]="heading | kebabCase"
          [routerLink]="currentPath">
          {{ heading }}
        </a>
      }
    </div>
    <markdown [data]="data"></markdown>
  `,
  styleUrl: './markdown-renderer.component.scss',
  imports: [KebabCasePipe, MarkdownComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownRendererComponent implements AfterViewInit, OnChanges {
  @Input() public data?: string;

  public currentPath: string;
  public headings: string[] = [];

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private readonly renderer: Renderer2,
    private readonly routingService: RoutingService,
  ) {
    this.currentPath = this._document.location.pathname;
  }

  public ngOnChanges(changes: NgChanges<MarkdownRendererComponent>): void {
    if (changes.data) {
      this.renderer.setStyle(
        this._document.querySelector('markdown'),
        'visibility',
        'hidden',
      );

      setTimeout(() => {
        this.wrapMarkdownTables();
        this.addBlockquoteIcons();
        this.addAnchorIdsToHeadings();

        this.renderer.removeStyle(this._document.querySelector('markdown'), 'visibility');
      });
    }
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      // Scroll to anchor when heading link is clicked
      this.routingService.fragment$
        .pipe(untilDestroyed(this))
        .subscribe(fragment => this.scrollToAnchor(fragment));
    });
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

  private addBlockquoteIcons(): void {
    const blockquoteElements = this._document.querySelectorAll('blockquote');

    if (blockquoteElements) {
      blockquoteElements.forEach(blockquoteElement => {
        if (!blockquoteElement.classList.contains('lcc-blockquote')) {
          blockquoteElement.classList.add('lcc-blockquote');

          const quoteIconElement = this._document.createElement('div');
          quoteIconElement.classList.add('lcc-quote-icon');
          quoteIconElement.style.backgroundImage = 'url("/assets/open-quote-icon.svg")';

          if (blockquoteElement.firstChild) {
            blockquoteElement.insertBefore(
              quoteIconElement,
              blockquoteElement.firstChild,
            );
          } else {
            blockquoteElement.appendChild(quoteIconElement);
          }

          blockquoteElement.style.position = 'relative';
        }
      });
    }
  }

  private addAnchorIdsToHeadings(): void {
    const headingElements = this._document.querySelectorAll('markdown h2');

    const newHeadings: string[] = [];

    if (headingElements) {
      headingElements.forEach(element => {
        const heading = (element.textContent || element.innerHTML).replace(
          /(<([^>]+)>)/gi,
          '',
        );

        element.setAttribute('id', kebabCase(heading));
        newHeadings.push(heading);
      });
    }

    this.headings = newHeadings;
  }

  private scrollToAnchor(anchorId?: string | null): void {
    if (!anchorId) {
      return;
    }

    const headingElement = this._document.getElementById(anchorId);

    if (headingElement) {
      headingElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }
}
