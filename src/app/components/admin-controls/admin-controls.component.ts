import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import IconsModule from '@app/icons';
import { RouterLinkPipe } from '@app/pipes';
import { AdminControlsConfig } from '@app/types/admin-controls-config.model';

import { ADMIN_CONTROLS_CONFIG } from './admin-controls.directive';

@Component({
  selector: 'lcc-admin-controls',
  templateUrl: './admin-controls.component.html',
  styleUrl: './admin-controls.component.scss',
  imports: [CommonModule, IconsModule, RouterLink, RouterLinkPipe, TooltipDirective],
})
export class AdminControlsComponent {
  @Output() public controlsHovered = new EventEmitter<boolean>();

  constructor(@Inject(ADMIN_CONTROLS_CONFIG) public config: AdminControlsConfig) {}

  @HostListener('mouseenter')
  private onMouseEnter = () => this.controlsHovered.emit(true);

  @HostListener('mouseleave')
  private onMouseLeave = () => this.controlsHovered.emit(false);
}
