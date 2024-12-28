import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';

import {
  ConnectedPosition,
  Overlay,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  HostListener,
  InjectionToken,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';

import { AdminControlsConfig } from '@app/types';
import { isDefined } from '@app/utils';

import { AdminControlsComponent } from './admin-controls.component';

export const ADMIN_CONTROLS_CONFIG = new InjectionToken('Admin Controls Config');

@UntilDestroy()
@Directive({
  selector: '[adminControls]',
})
export class AdminControlsDirective implements OnInit, OnDestroy {
  @Input() public adminControls: AdminControlsConfig | null = null;

  private controlsHovered$ = new BehaviorSubject<boolean>(true);
  private hostHovered$ = new Subject<boolean>();
  private overlayRef: OverlayRef | null = null;

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly overlay: Overlay,
    private readonly viewContainerRef: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    combineLatest([this.controlsHovered$, this.hostHovered$]).subscribe(
      ([controlsHovered, hostHovered]) => {
        // TODO: Needs fixing... obviously
        if (!controlsHovered && !hostHovered) {
          // this.detach();
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
  }

  private attach(): void {
    if (!isDefined(this.adminControls)) {
      return;
    }

    if (this.overlayRef === null) {
      const positionStrategy = this.getPositionStrategy();
      const scrollStrategy = this.getScrollStrategy();
      this.overlayRef = this.overlay.create({ positionStrategy, scrollStrategy });
    }

    const injector = Injector.create({
      providers: [
        {
          provide: ADMIN_CONTROLS_CONFIG,
          useValue: this.adminControls,
        },
      ],
    });

    const componentPortal = new ComponentPortal(
      AdminControlsComponent,
      this.viewContainerRef,
      injector,
    );

    const controlsRef = this.overlayRef.attach(componentPortal);
    controlsRef.instance.controlsHovered.subscribe(value =>
      this.controlsHovered$.next(value),
    );
  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    if (this.adminControls) {
      this.attach();
      this.hostHovered$.next(true);
    }
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.hostHovered$.next(false);
  }

  private detach(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef?.detach();
    }
  }

  private getPositionStrategy(): PositionStrategy {
    const position: ConnectedPosition = {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      panelClass: 'bottom',
    };

    return this.overlay
      .position()
      .flexibleConnectedTo(this.element)
      .withPositions([position]);
  }

  private getScrollStrategy(): ScrollStrategy {
    return this.overlay.scrollStrategies.close();
  }
}
