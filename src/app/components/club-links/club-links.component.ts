import { Component } from '@angular/core';

import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import IconsModule from '@app/icons';

@Component({
  selector: 'lcc-club-links',
  templateUrl: './club-links.component.html',
  styleUrl: './club-links.component.scss',
  imports: [IconsModule, ImagePreloadDirective],
})
export class ClubLinksComponent {}
