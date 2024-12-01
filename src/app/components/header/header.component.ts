import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipesModule } from '@app/pipes';
import { NavPathTypes } from '@app/types';

@Component({
  standalone: true,
  selector: 'lcc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, PipesModule, RouterModule],
})
export class HeaderComponent {
  readonly NavPathTypes = NavPathTypes;
}
