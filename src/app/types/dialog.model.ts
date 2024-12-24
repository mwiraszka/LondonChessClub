import { EventEmitter, Type } from '@angular/core';

export interface Dialog {
  title: string;
  body: string;
  confirmButtonText: string;
  confirmButtonType?: 'primary' | 'warning';
  cancelButtonText?: string;
}

export type BasicDialogResult = 'confirm' | 'cancel';

/**
 * Must be implemented by any component class dynamically rendered within the Dialog Component
 */
export interface DialogOutput<TResult> {
  dialogResult: EventEmitter<TResult | 'close'>;
}

export interface DialogConfig<TComponent> {
  componentType: Type<TComponent>;
  inputs?: { [key: string]: unknown };
  isModal?: boolean;
}
