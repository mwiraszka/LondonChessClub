import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavPathTypes } from '@app/core/nav';
import { MOCK_EVENTS } from '@app/pages/schedule/mock-events';

@Component({
  selector: 'lcc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  NavPathTypes = NavPathTypes;
  mockEvents = MOCK_EVENTS.slice(0, 3); // temp

  constructor(private router: Router) {}

  onNavigate(path: NavPathTypes) {
    this.router.navigate([path]);
  }
}
