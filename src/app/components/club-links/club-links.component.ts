import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import IconsModule from '@app/icons';

@Component({
  selector: 'lcc-club-links',
  templateUrl: './club-links.component.html',
  styleUrl: './club-links.component.scss',
  imports: [CommonModule, IconsModule],
})
export class ClubLinksComponent {}
