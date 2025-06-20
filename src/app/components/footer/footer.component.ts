import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import packageJson from '../../../../package.json';

@Component({
  selector: 'lcc-footer',
  template: `
    <small class="copyright-notice">
      Copyright &copy; {{ currentYear }}
      <b>London Chess Club</b>
    </small>

    <address class="website-details">
      <span class="current-version">v{{ currentVersion }}</span>
      <span class="divider">|</span>
      <a
        href="https://github.com/mwiraszka/LondonChessClub#readme"
        class="lcc-link"
        rel="noopener noreferrer"
        target="_blank">
        <span>Source code</span>
        <mat-icon>open_in_new</mat-icon>
      </a>
      <span class="divider">|</span>
      <a
        href="mailto:michal@londonchess.ca?subject=LCC%20Website%20-%20Bug%20Report"
        class="lcc-link"
        rel="noopener noreferrer"
        target="_blank">
        <span>Report a bug</span>
        <mat-icon>open_in_new</mat-icon>
      </a>
    </address>
  `,
  styleUrl: './footer.component.scss',
  imports: [MatIconModule],
})
export class FooterComponent {
  public readonly currentVersion = packageJson.version;
  public readonly currentYear = new Date().getFullYear();
}
