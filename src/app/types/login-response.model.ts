import { User } from './user.model';

export interface LoginResponse {
  adminUser?: User;
  error?: Error;
}
