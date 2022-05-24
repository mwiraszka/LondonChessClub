export enum UserRoleTypes {
  DEFAULT,
  ADMIN,
}

export interface User {
  id: string;
  email: string;
  isVerified: boolean;
  role: UserRoleTypes.DEFAULT | UserRoleTypes.ADMIN;
}
