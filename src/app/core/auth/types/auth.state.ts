import { User } from '@app/shared/types';

export interface AuthState {
  user: User | null;
}
