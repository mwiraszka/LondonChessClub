export interface PasswordChangeRequest {
  email: string;
  newPassword: string;
  code: string;
}
