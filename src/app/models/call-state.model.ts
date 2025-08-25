import { IsoDate } from './core.model';
import { LccError } from './error.model';

export interface CallState {
  status: 'idle' | 'loading' | 'error';
  loadStart: IsoDate | null;
  error: LccError | null;
}
