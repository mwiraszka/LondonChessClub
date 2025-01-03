import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import IconsModule from '@app/icons';
import { FormatDatePipe } from '@app/pipes';
import type { ModificationInfo } from '@app/types';

@Component({
  selector: 'lcc-modification-info',
  templateUrl: './modification-info.component.html',
  styleUrl: './modification-info.component.scss',
  imports: [CommonModule, FormatDatePipe, IconsModule],
})
export class ModificationInfoComponent {
  @Input({ required: true }) info!: ModificationInfo;
}
