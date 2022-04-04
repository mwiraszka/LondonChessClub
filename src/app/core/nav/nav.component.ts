import { Component } from '@angular/core';
import { ClarityIcons, userIcon } from '@cds/core/icon';

import { NavFacade } from './store/nav.facade';
import { NavPaths } from './types/nav-paths.model';

@Component({
  selector: 'lcc-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers: [NavFacade],
})
export class NavComponent {
  NavPaths = NavPaths;

  // ::: temp
  public isUserOptionsOpen = true;
  public userFirstName = 'Michal';

  constructor(public facade: NavFacade) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(userIcon);
  }
}
