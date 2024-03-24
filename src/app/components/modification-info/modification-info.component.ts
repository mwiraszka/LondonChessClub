import { Component, Input } from '@angular/core';

import type { ModificationInfo } from '@app/types';

@Component({
  selector: 'lcc-modification-info',
  templateUrl: './modification-info.component.html',
  styleUrls: ['./modification-info.component.scss'],
})
export class ModificationInfoComponent {
  @Input() info!: ModificationInfo;
}
