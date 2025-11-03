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
  let handlerSpy: jest.SpyInstance;
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
    handlerSpy = jest.spyOn(mockHandler, 'handle');
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

      expect(handlerSpy).toHaveBeenCalledWith(
        expect.objectContaining({ withCredentials: true }),
      );
    });

    it('should pass through successful requests', done => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockResponse = { status: 200 };

      handlerSpy.mockReturnValue(of(mockResponse));

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

      handlerSpy.mockReturnValue(throwError(() => error));

      interceptor.intercept(mockRequest, mockHandler).subscribe({
        error: (err: unknown) => {
          expect(err).toEqual(error);
          done();
        },
      });
    });
  });

  describe('401 error handling', () => {
    it('should refresh session on 401 error', done => {
      const mockRequest = new HttpRequest('GET', '/api/test');

      handlerSpy.mockReturnValueOnce(throwError(() => ({ status: 401 })));
      handlerSpy.mockReturnValueOnce(of({ status: 200 }));
      refreshSessionSpy.mockReturnValue(of({}));

      interceptor.intercept(mockRequest, mockHandler).subscribe({
        next: () => {
          expect(refreshSessionSpy).toHaveBeenCalled();
          expect(handlerSpy).toHaveBeenCalledTimes(2);
          done();
        },
      });
    });

    it('should retry request after successful refresh', done => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const successResponse = { status: 200, data: 'success' };

      handlerSpy.mockReturnValueOnce(throwError(() => ({ status: 401 })));
      handlerSpy.mockReturnValueOnce(of(successResponse));
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

      handlerSpy.mockReturnValue(throwError(() => ({ status: 401 })));
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

      handlerSpy.mockReturnValueOnce(throwError(() => ({ status: 401 })));
      handlerSpy.mockReturnValueOnce(of({ status: 200 }));
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
