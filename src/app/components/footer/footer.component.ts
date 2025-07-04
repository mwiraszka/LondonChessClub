import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';

import packageJson from '../../../../package.json';

@Component({
  selector: 'lcc-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [ImagePreloadDirective, MatIconModule, RouterLink, TooltipDirective],
})
export class FooterComponent {
  public CURRENT_VERSION = packageJson.version;
  public CURRENT_YEAR = new Date().getFullYear();
}
