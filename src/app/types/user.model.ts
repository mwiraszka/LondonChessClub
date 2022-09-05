export interface User {
  id?: string;
  firstName?: string;
  email?: string;
  isVerified?: boolean;
  hasCode?: boolean;
  role?: 'admin' | 'default';
}
