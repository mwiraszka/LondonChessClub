import { provideMockStore } from '@ngrx/store/testing';

import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiResponse, User } from '@app/models';
import { AuthSelectors } from '@app/store/auth';

import { environment } from '@env';

import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  const apiBaseUrl = `${environment.lccApiBaseUrl}/users`;
  const mockUser: User = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    isAdmin: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthApiService,
        provideHttpClientTesting(),
        provideMockStore({
          selectors: [{ selector: AuthSelectors.selectUserId, value: '123' }],
        }),
      ],
    });

    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logIn', () => {
    it('should log in user with email and password', () => {
      const email = 'john.doe@example.com';
      const password = 'password123';
      const mockResponse: ApiResponse<User> = {
        data: mockUser,
      };

      service.logIn(email, password).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password });
      req.flush(mockResponse);
    });
  });

  describe('logOut', () => {
    it('should log out user', () => {
      const mockResponse: ApiResponse<'success'> = {
        data: 'success',
      };

      service.logOut().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/logout`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(mockResponse);
    });
  });

  describe('refreshSession', () => {
    it('should refresh session using userId from store', () => {
      const mockResponse: ApiResponse<'success'> = {
        data: 'success',
      };

      service.refreshSession().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/refresh-session`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ userId: '123' });
      req.flush(mockResponse);
    });
  });

  describe('sendCodeForPasswordChange', () => {
    it('should send code for password change', () => {
      const email = 'john.doe@example.com';
      const mockResponse: ApiResponse<'success'> = {
        data: 'success',
      };

      service.sendCodeForPasswordChange(email).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/send-code`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
    });
  });

  describe('changePassword', () => {
    it('should change password with email, password, and code', () => {
      const email = 'john.doe@example.com';
      const password = 'newPassword123';
      const code = '123456';
      const mockResponse: ApiResponse<User> = {
        data: mockUser,
      };

      service.changePassword(email, password, code).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/change-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password, code });
      req.flush(mockResponse);
    });
  });
});
