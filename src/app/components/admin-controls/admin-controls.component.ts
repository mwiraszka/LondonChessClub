import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnDestroy, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import IconsModule from '@app/icons';
import { AdminControlsConfig } from '@app/models/admin-controls-config.model';
import { IsDefinedPipe, RouterLinkPipe } from '@app/pipes';

import { ADMIN_CONTROLS_CONFIG } from './admin-controls.directive';

@Component({
  selector: 'lcc-admin-controls',
  templateUrl: './admin-controls.component.html',
  styleUrl: './admin-controls.component.scss',
  imports: [
    CommonModule,
    IconsModule,
    IsDefinedPipe,
    RouterLink,
    RouterLinkPipe,
    TooltipDirective,
  ],
})
export class AdminControlsComponent implements OnDestroy {
  @Output() destroyed = new EventEmitter<void>();

  constructor(@Inject(ADMIN_CONTROLS_CONFIG) public config: AdminControlsConfig) {}

  ngOnDestroy(): void {
    this.destroyed.emit();
  }
}
