import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ClubMapComponent } from '@app/components/club-map/club-map.component';
import IconsModule from '@app/icons';
import { NavPathTypes } from '@app/types';

@Component({
  selector: 'lcc-club-summary',
  templateUrl: './club-summary.component.html',
  styleUrl: './club-summary.component.scss',
  imports: [ClubMapComponent, CommonModule, IconsModule, RouterLink],
})
export class ClubSummaryComponent {
  public readonly NavPathTypes = NavPathTypes;
}
