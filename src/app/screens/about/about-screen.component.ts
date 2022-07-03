import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NavPathTypes } from '@app/core/nav';
import { ClarityIcons, unknownStatusIcon } from '@cds/core/icon';

@Component({
  selector: 'lcc-about-screen',
  templateUrl: './about-screen.component.html',
  styleUrls: ['./about-screen.component.scss'],
})
export class AboutScreenComponent implements OnInit {
  NavPathTypes = NavPathTypes;

  constructor(private router: Router) {}

  onNavigate(path: NavPathTypes) {
    this.router.navigate([path]);
  }

  ngOnInit(): void {
    ClarityIcons.addIcons(unknownStatusIcon);
  }
}
