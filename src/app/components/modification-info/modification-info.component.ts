import { Component, Input } from '@angular/core';

import IconsModule from '@app/icons';
import type { ModificationInfo } from '@app/models';
import { FormatDatePipe } from '@app/pipes';

@Component({
  selector: 'lcc-modification-info',
  templateUrl: './modification-info.component.html',
  styleUrl: './modification-info.component.scss',
  imports: [FormatDatePipe, IconsModule],
})
export class ModificationInfoComponent {
  @Input({ required: true }) info!: ModificationInfo;
}
