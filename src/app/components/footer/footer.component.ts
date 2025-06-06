import { Component } from '@angular/core';

import IconsModule from '@app/icons';

import packageJson from '../../../../package.json';

@Component({
  selector: 'lcc-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [IconsModule],
})
export class FooterComponent {
  public readonly currentVersion = packageJson.version;
  public readonly currentYear = new Date().getFullYear();
}
