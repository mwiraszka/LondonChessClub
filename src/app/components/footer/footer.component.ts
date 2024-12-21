import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import packageJson from '../../../../package.json';

@Component({
  selector: 'lcc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [CommonModule],
})
export class FooterComponent {
  public readonly currentVersion = packageJson.version;
  public readonly currentYear = new Date().getFullYear();
}
