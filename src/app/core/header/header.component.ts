import { Component, OnInit } from '@angular/core';
import { ClarityIcons, userIcon } from '@cds/core/icon';
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';

import { NavFacade, NavPaths } from '@app/core/nav';

@Component({
  selector: 'lcc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [NavFacade],
})
export class HeaderComponent implements OnInit {
  NavPaths = NavPaths;
  lccIcon: IconShapeTuple = [
    'lcc-logo',
    `<svg viewBox="0 0 45 45">
        <use xlink:href="../../assets/lcc-logo.svg#logo">
        </use>
      </svg>
    `,
  ];

  public fakeUserName = 'Michal';

  constructor(public facade: NavFacade) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(userIcon, this.lccIcon);
  }

  onLogoutSelected(): void {
    console.log('::: onLogoutSelected()');
  }
}
