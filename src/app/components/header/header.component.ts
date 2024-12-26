import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RangePipe } from '@app/pipes';

@Component({
  selector: 'lcc-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [CommonModule, RangePipe, RouterModule],
})
export class HeaderComponent {}
