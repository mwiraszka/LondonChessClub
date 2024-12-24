import { EventEmitter, Type } from '@angular/core';

/**
 * Must be implemented by any component class dynamically rendered within the Dialog Component
 */
export interface DialogOutput<TResult> {
  dialogResult: EventEmitter<TResult | 'close'>;
}

export interface DialogConfig<TComponent> {
  componentType: Type<TComponent>;
  inputs?: { [key: string]: unknown };
}
