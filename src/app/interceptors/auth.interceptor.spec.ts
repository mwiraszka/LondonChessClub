import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AuthApiService } from '@app/services';
import { AuthActions } from '@app/store/auth';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: HttpInterceptor;

  let mockAuthApiService: AuthApiService;
  let mockHandler: HttpHandler;
  let store: MockStore;

  let dispatchSpy: jest.SpyInstance;
  let handleSpy: jest.SpyInstance;
  let refreshSessionSpy: jest.SpyInstance;

  beforeEach(() => {
    mockAuthApiService = {
      refreshSession: jest.fn().mockReturnValue(of({})),
    } as unknown as AuthApiService;

    mockHandler = {
      handle: jest.fn().mockReturnValue(of({})),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: AuthApiService, useValue: mockAuthApiService },
        provideMockStore(),
      ],
    });

    interceptor = TestBed.inject(AuthInterceptor);
    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, 'dispatch');
    handleSpy = jest.spyOn(mockHandler, 'handle');
    refreshSessionSpy = jest.spyOn(mockAuthApiService, 'refreshSession');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept', () => {
    it('should add withCredentials to request', () => {
      const mockRequest = new HttpRequest('GET', '/api/test');

      interceptor.intercept(mockRequest, mockHandler);

      expect(handleSpy).toHaveBeenCalledWith(
        expect.objectContaining({ withCredentials: true }),
      );
    });

    it('should pass through successful requests', done => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockResponse = { status: 200 };

      handleSpy.mockReturnValue(of(mockResponse));

      interceptor.intercept(mockRequest, mockHandler).subscribe({
        next: (response: HttpEvent<unknown>) => {
          expect(response).toEqual(mockResponse);
          done();
        },
      });
    });

    it('should handle non-401 errors', done => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const error = { status: 500, message: 'Server error' };

      handleSpy.mockReturnValue(throwError(() => error));

      interceptor.intercept(mockRequest, mockHandler).subscribe({
        error: (err: unknown) => {
          expect(err).toEqual(error);
          done();
        },
      });
    });
  });

  describe('401 error handling', () => {
    it('should not attempt to refresh session on 401 error to refresh-session endpoint', done => {
      const mockRequest = new HttpRequest('GET', '/refresh-session');

      handleSpy.mockReturnValueOnce(throwError(() => ({ status: 401 })));

      interceptor.intercept(mockRequest, mockHandler).subscribe({
        next: () => {
          expect(refreshSessionSpy).not.toHaveBeenCalled();
          expect(dispatchSpy).toHaveBeenCalledWith(
            AuthActions.logoutRequested({ sessionExpired: true }),
          );
          done();
        },
      });
    });

    it('should refresh session on 401 error', done => {
      const mockRequest = new HttpRequest('GET', '/api/test');

      handleSpy.mockReturnValueOnce(throwError(() => ({ status: 401 })));
      handleSpy.mockReturnValueOnce(of({ status: 200 }));
      refreshSessionSpy.mockReturnValue(of({}));

      interceptor.intercept(mockRequest, mockHandler).subscribe({
        next: () => {
          expect(refreshSessionSpy).toHaveBeenCalled();
          expect(handleSpy).toHaveBeenCalledTimes(2);
          done();
        },
      });
    });

    it('should retry request after successful refresh', done => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const successResponse = { status: 200, data: 'success' };

      handleSpy.mockReturnValueOnce(throwError(() => ({ status: 401 })));
      handleSpy.mockReturnValueOnce(of(successResponse));
      refreshSessionSpy.mockReturnValue(of({}));

      interceptor.intercept(mockRequest, mockHandler).subscribe({
        next: (response: HttpEvent<unknown>) => {
          expect(response).toEqual(successResponse);
          done();
        },
      });
    });

    it('should dispatch logout on failed refresh', done => {
      const mockRequest = new HttpRequest('GET', '/api/test');

      handleSpy.mockReturnValue(throwError(() => ({ status: 401 })));
      refreshSessionSpy.mockReturnValue(throwError(() => new Error('Refresh failed')));

      interceptor.intercept(mockRequest, mockHandler).subscribe({
        next: () => {
          expect(dispatchSpy).toHaveBeenCalledWith(
            AuthActions.logoutRequested({ sessionExpired: true }),
          );
          done();
        },
      });
    });

    it('should handle concurrent 401 errors', done => {
      const mockRequest = new HttpRequest('GET', '/api/test');

      handleSpy.mockReturnValueOnce(throwError(() => ({ status: 401 })));
      handleSpy.mockReturnValueOnce(of({ status: 200 }));
      refreshSessionSpy.mockReturnValue(of({}));

      interceptor.intercept(mockRequest, mockHandler).subscribe({
        next: () => {
          expect(refreshSessionSpy).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });
  });
});
