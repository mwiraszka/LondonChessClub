import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lcc-club-links',
  templateUrl: './club-links.component.html',
  styleUrl: './club-links.component.scss',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubLinksComponent {}
