import { Component, OnInit } from '@angular/core';
import { ClarityIcons } from '@cds/core/icon';
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';

@Component({
  selector: 'lcc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  lccIcon: IconShapeTuple = [
    'lcc-logo',
    `
      <svg viewBox="0 0 45 45">
        <use xlink:href="../../assets/lcc-logo.svg#logo">
        </use>
      </svg>
    `,
  ];

  constructor() {}

  ngOnInit(): void {
    ClarityIcons.addIcons(this.lccIcon);
  }
}
