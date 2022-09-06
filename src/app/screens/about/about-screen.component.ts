import { Component } from '@angular/core';

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

  constructor(public facade: AboutScreenFacade) {}
}
