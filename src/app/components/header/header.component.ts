import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RangePipe } from '@app/pipes/range.pipe';
import { NavPathTypes } from '@app/types';

@Component({
  selector: 'lcc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RangePipe, RouterModule],
})
export class HeaderComponent {
  public readonly NavPathTypes = NavPathTypes;
}
