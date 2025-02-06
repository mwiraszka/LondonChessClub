import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { kebabCase } from 'lodash';
import { MarkdownComponent } from 'ngx-markdown';
import { filter, first } from 'rxjs/operators';

import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';

import { KebabCasePipe } from '@app/pipes';

@UntilDestroy()
@Component({
  selector: 'lcc-markdown-renderer',
  template: `
    <div class="table-of-contents">
      @for (heading of headings; track heading) {
        <a
          class="heading-link lcc-link"
          [routerLink]="currentPath"
          [fragment]="heading | kebabCase">
          {{ heading }}
        </a>
      }
    </div>
    <markdown [data]="data"></markdown>
  `,
  styleUrl: './markdown-renderer.component.scss',
  imports: [CommonModule, KebabCasePipe, MarkdownComponent, RouterLink],
})
export class MarkdownRendererComponent implements AfterViewInit, OnChanges {
  @Input() public data?: string;

  public currentFragment: string | null = null;
  public currentPath: string;
  public headings: string[] = [];

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.currentPath = this._document.location.pathname;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      setTimeout(() => {
        this.wrapMarkdownTables();
        this.addAnchorIdsToHeadings();
      });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Scroll to anchor on initial load
      this.activatedRoute.fragment
        .pipe(first())
        .subscribe(fragment => this.scrollToAnchor(fragment));
    });

    // Scroll to anchor when heading link is clicked (will still scroll even if fragment hasn't changed)
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe(event => this.scrollToAnchor(event.url.split('#')[1]));
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
