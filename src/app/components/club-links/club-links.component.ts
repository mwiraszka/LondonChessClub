import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ImagePreloadDirective } from '@app/directives/image-preload.directive';

@Component({
  selector: 'lcc-club-links',
  templateUrl: './club-links.component.html',
  styleUrl: './club-links.component.scss',
  imports: [ImagePreloadDirective, MatIconModule],
})
export class ClubLinksComponent {}
