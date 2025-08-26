import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { RangePipe } from '@app/pipes';

@Component({
  selector: 'lcc-header',
  template: `
    <div class="app-header-container">
      <section class="branding">
        <a
          class="branding-link"
          routerLink="">
          <div class="image-container">
            <img
              decoding="async"
              fetchpriority="high"
              [image]="{
                mainUrl: 'assets/lcc-branding.svg',
                caption: 'London Chess Club',
              }" />
          </div>
        </a>
        <a
          class="club-name-link"
          routerLink="">
          <h1>London Chess Club</h1>
        </a>
      </section>

      <section class="chess-pieces">
        @for (num of 5 | range: 1; track num) {
          <img
            [ngClass]="'pieces-' + num"
            src="assets/chess-pieces.svg"
            alt="Chess pieces" />
        }
      </section>
    </div>
  `,
  styleUrl: './header.component.scss',
  imports: [CommonModule, ImagePreloadDirective, RangePipe, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
