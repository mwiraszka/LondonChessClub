import { EventEmitter } from '@angular/core';

/**
 * Required controls for components display within Dialog Component
 */
export interface DialogControls {
  close: EventEmitter<void>;
  confirm: EventEmitter<string>;
}
