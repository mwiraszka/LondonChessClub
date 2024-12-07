import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { IconsModule } from '@app/icons';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import type { ModificationInfo } from '@app/types';

@Component({
  selector: 'lcc-modification-info',
  templateUrl: './modification-info.component.html',
  styleUrls: ['./modification-info.component.scss'],
  imports: [CommonModule, FormatDatePipe, IconsModule],
})
export class ModificationInfoComponent {
  @Input() info!: ModificationInfo;
}
