import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavPathTypes } from '@app/core/nav';
import { MOCK_EVENTS } from '@app/screens/schedule/mock-events';

@Component({
  selector: 'lcc-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent {
  NavPathTypes = NavPathTypes;
  mockEvents = MOCK_EVENTS.slice(0, 3); // temp

  constructor(private router: Router) {}

  onNavigate(path: NavPathTypes) {
    this.router.navigate([path]);
  }
}
