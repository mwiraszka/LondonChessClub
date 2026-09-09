import { Id } from './core.model';

export interface User {
  id: Id;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}
