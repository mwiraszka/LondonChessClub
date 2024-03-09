import { Component } from '@angular/core';

import packageJson from '../../../../package.json';

@Component({
  selector: 'lcc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  version = packageJson.version;
  currentYear = new Date().getFullYear();
}
