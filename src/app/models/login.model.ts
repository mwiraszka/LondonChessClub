import { AdminUser, UnverifiedUser } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
  temporaryPassword?: string;
}

export interface LoginResponse {
  adminUser?: AdminUser;
  unverifiedUser?: UnverifiedUser;
  temporaryPassword?: string;
  error?: Error;
}
