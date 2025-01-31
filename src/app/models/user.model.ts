export interface User {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

export type AdminUser = User & { isAdmin: true };
