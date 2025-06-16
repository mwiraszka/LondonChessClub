import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
              [image]="{
                originalUrl: 'assets/lcc-branding.svg',
                width: 60,
                height: 60,
                caption: 'LCC branding',
              }" />
          </div>
        </a>
        <a
          class="club-name-link"
          routerLink="">
          London Chess Club
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
})
export class HeaderComponent {}
