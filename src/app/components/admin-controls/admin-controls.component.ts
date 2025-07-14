import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ADMIN_CONTROLS_CONFIG_TOKEN } from '@app/directives/admin-controls.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import { AdminControlsConfig } from '@app/models/admin-controls-config.model';
import { IsDefinedPipe, RouterLinkPipe } from '@app/pipes';
import { KeyStateService } from '@app/services';
import { isTouchDevice } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-admin-controls',
  templateUrl: './admin-controls.component.html',
  styleUrl: './admin-controls.component.scss',
  imports: [
    CommonModule,
    IsDefinedPipe,
    MatIconModule,
    RouterLink,
    RouterLinkPipe,
    TooltipDirective,
  ],
})
export class AdminControlsComponent implements OnInit, OnDestroy {
  @Output() destroyed = new EventEmitter<void>();

  public showDeleteButton!: boolean;
  public isTouchDevice = isTouchDevice();

  constructor(
    @Inject(ADMIN_CONTROLS_CONFIG_TOKEN) public config: AdminControlsConfig,
    private readonly elementRef: ElementRef,
    private readonly keyStateService: KeyStateService,
  ) {}

  public ngOnInit(): void {
    this.elementRef.nativeElement.style.setProperty(
      '--admin-control-button-size',
      `${this.config.buttonSize}px`,
    );

    if (this.isTouchDevice) {
      this.showDeleteButton = true;
    } else {
      this.keyStateService.ctrlMetaKeyPressed$
        .pipe(untilDestroyed(this))
        .subscribe(isPressed => {
          this.showDeleteButton = isPressed;
        });
    }
  }

  public ngOnDestroy(): void {
    this.destroyed.emit();
  }
}
