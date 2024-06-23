import { Component } from '@angular/core';

import { ThemeToggleFacade } from './theme-toggle.facade';

@Component({
  selector: 'lcc-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  providers: [ThemeToggleFacade],
})
export class ThemeToggleComponent {
  constructor(public facade: ThemeToggleFacade) {}
}
