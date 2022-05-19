export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'member' | 'admin';
  isAuthenticated: boolean;
}
