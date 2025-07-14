import { BehaviorSubject, Observable } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
  OnDestroy,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

import { isMac } from '@app/utils';

@Injectable({
  providedIn: 'root',
})
export class KeyStateService implements OnDestroy {
  private isCtrlMetaKeyPressed = new BehaviorSubject<boolean>(false);
  private keyDownListener?: () => void;
  private keyUpListener?: () => void;
  private renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.setupGlobalListeners();
  }

  public get ctrlMetaKeyPressed$(): Observable<boolean> {
    return this.isCtrlMetaKeyPressed.asObservable();
  }

  public ngOnDestroy(): void {
    this.keyDownListener?.();
    this.keyUpListener?.();
  }

  private setupGlobalListeners(): void {
    this.keyDownListener = this.renderer.listen(
      this._document,
      'keydown',
      (event: KeyboardEvent) => {
        if ((!isMac() && event.key === 'Control') || (isMac() && event.key === 'Meta')) {
          this.isCtrlMetaKeyPressed.next(true);
        }
      },
    );

    this.keyUpListener = this.renderer.listen(
      this._document,
      'keyup',
      (event: KeyboardEvent) => {
        if ((!isMac() && event.key === 'Control') || (isMac() && event.key === 'Meta')) {
          this.isCtrlMetaKeyPressed.next(false);
        }
      },
    );
  }
}
