import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiResponse, DbCollection, User } from '@app/models';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_BASE_URL = environment.lccApiBaseUrl;
  private readonly COLLECTION: DbCollection = 'users';

  constructor(private readonly http: HttpClient) {}

  public logIn(email: string, password: string): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/login`,
      { email, password },
    );
  }

  public logOut(): Observable<ApiResponse<'success'>> {
    return this.http.post<ApiResponse<'success'>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/logout`,
      null,
    );
  }

  public sendCodeForPasswordChange(email: string): Observable<ApiResponse<'success'>> {
    return this.http.post<ApiResponse<'success'>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/send-code`,
      { email },
    );
  }

  public changePassword(
    email: string,
    password: string,
    code: string,
  ): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/change-password`,
      { email, password, code },
    );
  }
}
