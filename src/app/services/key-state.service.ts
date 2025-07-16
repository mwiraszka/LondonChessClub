import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';

import { isMac } from '@app/utils';

@Injectable({
  providedIn: 'root',
})
export class KeyStateService implements OnDestroy {
  private isCtrlMetaKeyPressed = new BehaviorSubject<boolean>(false);
  private keydownListener?: () => void;
  private keyupListener?: () => void;
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.setupGlobalListeners();
  }

  public get ctrlMetaKeyPressed$(): Observable<boolean> {
    return this.isCtrlMetaKeyPressed.asObservable();
  }

  public ngOnDestroy(): void {
    this.keydownListener?.();
    this.keyupListener?.();
  }

  private setupGlobalListeners(): void {
    this.keydownListener = this.renderer.listen(
      'document',
      'keydown',
      (event: KeyboardEvent) => {
        if ((!isMac() && event.key === 'Control') || (isMac() && event.key === 'Meta')) {
          this.isCtrlMetaKeyPressed.next(true);
        }
      },
    );

    this.keyupListener = this.renderer.listen(
      'document',
      'keyup',
      (event: KeyboardEvent) => {
        if ((!isMac() && event.key === 'Control') || (isMac() && event.key === 'Meta')) {
          this.isCtrlMetaKeyPressed.next(false);
        }
      },
    );
  }
}
