import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiResponse, DbCollection, User } from '@app/models';
import { AuthSelectors } from '@app/store/auth';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly API_BASE_URL = environment.lccApiBaseUrl;
  private readonly COLLECTION: DbCollection = 'users';

  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
  ) {}

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

  public refreshSession(): Observable<ApiResponse<'success'>> {
    return this.store
      .select(AuthSelectors.selectUserId)
      .pipe(
        switchMap(userId =>
          this.http.post<ApiResponse<'success'>>(
            `${this.API_BASE_URL}/${this.COLLECTION}/refresh-session`,
            { userId },
          ),
        ),
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
