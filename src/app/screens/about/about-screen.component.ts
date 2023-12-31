import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavPathTypes } from '@app/types';

import { AboutScreenFacade } from './about-screen.facade';

@Component({
  selector: 'lcc-about-screen',
  templateUrl: './about-screen.component.html',
  styleUrls: ['./about-screen.component.scss'],
  providers: [AboutScreenFacade],
})
export class AboutScreenComponent {
  NavPathTypes = NavPathTypes;

  constructor(public facade: AboutScreenFacade, private router: Router) {}

  onNavigate(path: NavPathTypes): void {
    this.router.navigate([path]);
  }
}
