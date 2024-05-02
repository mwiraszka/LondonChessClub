import { AdminUser, UnverifiedUser } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
  tempInitialPassword?: string;
}

export interface LoginResponse {
  adminUser?: AdminUser;
  unverifiedUser?: UnverifiedUser;
  tempInitialPassword?: string;
  error?: Error;
}
