export interface PasswordChangeRequest {
  email: string;
  newPassword: string;
  code: string;
}

export interface PasswordChangeResponse {
  email?: string;
  newPassword?: string;
  error?: Error;
}

export interface PasswordChangeFormData {
  email: string;
  newPassword: string;
  code?: string;
}
