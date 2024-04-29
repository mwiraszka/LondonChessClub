import { Component } from '@angular/core';

import { NavPathTypes } from '@app/types';

@Component({
  selector: 'lcc-club-summary',
  templateUrl: './club-summary.component.html',
  styleUrls: ['./club-summary.component.scss'],
})
export class ClubSummaryComponent {
  readonly NavPathTypes = NavPathTypes;
}
