export interface User {
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
}

export type AdminUser = User & { isVerified: true };
export type UnverifiedUser = User & { isVerified: false };
