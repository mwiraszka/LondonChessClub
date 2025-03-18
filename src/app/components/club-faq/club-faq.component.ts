import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ClubMapComponent } from '@app/components/club-map/club-map.component';
import IconsModule from '@app/icons';

@Component({
  selector: 'lcc-club-faq',
  templateUrl: './club-faq.component.html',
  styleUrl: './club-faq.component.scss',
  imports: [ClubMapComponent, CommonModule, IconsModule],
})
export class ClubFaqComponent {}
