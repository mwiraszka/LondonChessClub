import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import moment from 'moment-timezone';
import { ReplaySubject, of, throwError } from 'rxjs';

import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { INITIAL_IMAGE_FORM_DATA } from '@app/constants';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import {
  ApiResponse,
  BaseImage,
  Image,
  LccError,
  PaginatedItems,
  User,
} from '@app/models';
import { ImageFileService, ImagesApiService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';

import { ImagesActions, ImagesSelectors } from '.';
import { ImagesEffects } from './images.effects';

const mockParseError = jest.fn();
const mockIsExpired = jest.fn();
const mockDataUrlToFile = jest.fn();
const mockIsLccError = jest.fn();

jest.mock('@app/utils', () => ({
  isDefined: <T>(value: T | null | undefined): value is T => value != null,
  isExpired: (date: unknown) => mockIsExpired(date),
  isLccError: (value: unknown) => mockIsLccError(value),
  dataUrlToFile: (dataUrl: string, filename: string) =>
    mockDataUrlToFile(dataUrl, filename),
  parseError: (error: unknown) => mockParseError(error),
}));

describe('ImagesEffects', () => {
  let actions$: ReplaySubject<Action>;
  let effects: ImagesEffects;
  let imagesApiService: jest.Mocked<ImagesApiService>;
  let store: MockStore;

  const mockUser: User = {
    id: 'user123',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    isAdmin: true,
  };

  const mockError: LccError = {
    name: 'LCCError',
    message: 'Test error',
  };

  const mockApiResponse: ApiResponse<PaginatedItems<Image>> = {
    data: {
      items: [MOCK_IMAGES[0], MOCK_IMAGES[1]],
      filteredCount: 2,
      totalCount: 10,
    },
  };

  const mockImageMetadataResponse: ApiResponse<BaseImage[]> = {
    data: MOCK_IMAGES.map(img => ({
      id: img.id,
      filename: img.filename,
      caption: img.caption,
      album: img.album,
      albumCover: img.albumCover,
      albumOrdinality: img.albumOrdinality,
      modificationInfo: img.modificationInfo,
    })),
  };

  beforeEach(() => {
    const imagesApiServiceMock = {
      getAllImagesMetadata: jest.fn(),
      getFilteredThumbnailImages: jest.fn(),
      getBatchThumbnailImages: jest.fn(),
      getMainImage: jest.fn(),
      addImages: jest.fn(),
      updateImages: jest.fn(),
      deleteImage: jest.fn(),
      deleteAlbum: jest.fn(),
    };

    const imageFileServiceMock = {
      getImage: jest.fn(),
      getAllImages: jest.fn(),
      clearAllImages: jest.fn(),
    };

    const mockImagesState = {
      ids: MOCK_IMAGES.map(i => i.id),
      entities: MOCK_IMAGES.reduce(
        (acc, image) => ({
          ...acc,
          [image.id]: { image, formData: { ...INITIAL_IMAGE_FORM_DATA, id: image.id } },
        }),
        {},
      ),
      callState: { status: 'idle' as const, loadStart: null, error: null },
      newImageFormData: null,
      newImagesFormData: {},
      lastMetadataFetch: null,
      lastFilteredThumbnailsFetch: null,
      lastAlbumCoversFetch: null,
      options: {
        page: 1,
        pageSize: 12,
        sortBy: 'filename',
        sortOrder: 'asc',
        filters: null,
        search: '',
      },
      filteredCount: null,
      totalCount: 0,
    };

    TestBed.configureTestingModule({
      providers: [
        ImagesEffects,
        provideMockActions(() => actions$),
        { provide: ImagesApiService, useValue: imagesApiServiceMock },
        { provide: ImageFileService, useValue: imageFileServiceMock },
        provideMockStore({
          initialState: {
            imagesState: mockImagesState,
          },
        }),
      ],
    });

    effects = TestBed.inject(ImagesEffects);
    imagesApiService = TestBed.inject(ImagesApiService) as jest.Mocked<ImagesApiService>;
    store = TestBed.inject(MockStore);
    actions$ = new ReplaySubject<Action>(1);

    jest.clearAllMocks();
    mockParseError.mockImplementation(error => error);
    mockIsLccError.mockReturnValue(false);
  });

  describe('fetchAllImagesMetadata$', () => {
    it('should fetch all images metadata successfully', done => {
      imagesApiService.getAllImagesMetadata.mockReturnValue(
        of(mockImageMetadataResponse),
      );

      actions$.next(ImagesActions.fetchAllImagesMetadataRequested());

      effects.fetchAllImagesMetadata$.subscribe(action => {
        expect(action).toEqual(
          ImagesActions.fetchAllImagesMetadataSucceeded({
            images: mockImageMetadataResponse.data,
          }),
        );
        expect(imagesApiService.getAllImagesMetadata).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should handle fetch all images metadata failure', done => {
      imagesApiService.getAllImagesMetadata.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(ImagesActions.fetchAllImagesMetadataRequested());

      effects.fetchAllImagesMetadata$.subscribe(action => {
        expect(action).toEqual(
          ImagesActions.fetchAllImagesMetadataFailed({ error: mockError }),
        );
        expect(mockParseError).toHaveBeenCalledWith(mockError);
        done();
      });
    });
  });

  describe('fetchFilteredThumbnailImages$', () => {
    const mockOptions = {
      page: 1,
      pageSize: 12,
      sortBy: 'filename' as const,
      sortOrder: 'asc' as const,
      filters: null,
      search: 'chess',
    };

    beforeEach(() => {
      store.overrideSelector(ImagesSelectors.selectOptions, mockOptions);
      store.refreshState();
    });

    it('should fetch filtered thumbnail images with options from store', done => {
      imagesApiService.getFilteredThumbnailImages.mockReturnValue(of(mockApiResponse));

      actions$.next(ImagesActions.fetchFilteredThumbnailsRequested());

      effects.fetchFilteredThumbnailImages$.subscribe(action => {
        expect(action).toEqual(
          ImagesActions.fetchFilteredThumbnailsSucceeded({
            images: mockApiResponse.data.items,
            filteredCount: mockApiResponse.data.filteredCount,
            totalCount: mockApiResponse.data.totalCount,
          }),
        );
        expect(imagesApiService.getFilteredThumbnailImages).toHaveBeenCalledWith(
          mockOptions,
        );
        done();
      });
    });

    it('should handle fetch filtered thumbnail images failure', done => {
      imagesApiService.getFilteredThumbnailImages.mockReturnValue(
        throwError(() => mockError),
      );
      mockParseError.mockReturnValue(mockError);

      actions$.next(ImagesActions.fetchFilteredThumbnailsRequested());

      effects.fetchFilteredThumbnailImages$.subscribe(action => {
        expect(action).toEqual(
          ImagesActions.fetchFilteredThumbnailsFailed({ error: mockError }),
        );
        done();
      });
    });
  });

  describe('fetchBatchThumbnailImages$', () => {
    it('should fetch batch thumbnail images successfully', done => {
      const imageIds = [MOCK_IMAGES[0].id, MOCK_IMAGES[1].id];
      const mockBatchResponse: ApiResponse<Image[]> = {
        data: [MOCK_IMAGES[0], MOCK_IMAGES[1]],
      };
      imagesApiService.getBatchThumbnailImages.mockReturnValue(of(mockBatchResponse));

      actions$.next(
        ImagesActions.fetchBatchThumbnailsRequested({
          imageIds,
          context: 'album-covers',
        }),
      );

      effects.fetchBatchThumbnailImages$.subscribe(action => {
        expect(action).toEqual(
          ImagesActions.fetchBatchThumbnailsSucceeded({
            images: mockBatchResponse.data,
            context: 'album-covers',
          }),
        );
        expect(imagesApiService.getBatchThumbnailImages).toHaveBeenCalledWith(imageIds);
        done();
      });
    });

    it('should handle fetch batch thumbnail images failure', done => {
      const imageIds = [MOCK_IMAGES[0].id];
      imagesApiService.getBatchThumbnailImages.mockReturnValue(
        throwError(() => mockError),
      );
      mockParseError.mockReturnValue(mockError);

      actions$.next(
        ImagesActions.fetchBatchThumbnailsRequested({
          imageIds,
          context: 'album-covers',
        }),
      );

      effects.fetchBatchThumbnailImages$.subscribe(action => {
        expect(action).toEqual(
          ImagesActions.fetchBatchThumbnailsFailed({ error: mockError }),
        );
        done();
      });
    });
  });

  describe('fetchMainImage$', () => {
    it('should fetch main image successfully', done => {
      const mockMainImageResponse: ApiResponse<Image> = { data: MOCK_IMAGES[0] };
      imagesApiService.getMainImage.mockReturnValue(of(mockMainImageResponse));

      actions$.next(
        ImagesActions.fetchMainImageRequested({ imageId: MOCK_IMAGES[0].id }),
      );

      effects.fetchMainImage$.subscribe(action => {
        expect(action).toEqual(
          ImagesActions.fetchMainImageSucceeded({ image: MOCK_IMAGES[0] }),
        );
        expect(imagesApiService.getMainImage).toHaveBeenCalledWith(MOCK_IMAGES[0].id);
        done();
      });
    });

    it('should handle fetch main image failure', done => {
      imagesApiService.getMainImage.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(ImagesActions.fetchMainImageRequested({ imageId: 'invalid-id' }));

      effects.fetchMainImage$.subscribe(action => {
        expect(action).toEqual(ImagesActions.fetchMainImageFailed({ error: mockError }));
        done();
      });
    });
  });

  describe('fetchMainImageInBackground$', () => {
    it('should fetch main image in background successfully', done => {
      const mockMainImageResponse: ApiResponse<Image> = { data: MOCK_IMAGES[0] };
      imagesApiService.getMainImage.mockReturnValue(of(mockMainImageResponse));

      actions$.next(
        ImagesActions.fetchMainImageInBackgroundRequested({ imageId: MOCK_IMAGES[0].id }),
      );

      effects.fetchMainImageInBackground$.subscribe(action => {
        expect(action).toEqual(
          ImagesActions.fetchMainImageSucceeded({ image: MOCK_IMAGES[0] }),
        );
        expect(imagesApiService.getMainImage).toHaveBeenCalledWith(
          MOCK_IMAGES[0].id,
          true,
        );
        done();
      });
    });

    it('should handle fetch main image in background failure', done => {
      imagesApiService.getMainImage.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(
        ImagesActions.fetchMainImageInBackgroundRequested({ imageId: 'invalid-id' }),
      );

      effects.fetchMainImageInBackground$.subscribe(action => {
        expect(action).toEqual(ImagesActions.fetchMainImageFailed({ error: mockError }));
        done();
      });
    });
  });

  describe('refetchMetadata$', () => {
    it('should trigger refetch after addImageSucceeded', done => {
      const baseImage: BaseImage = {
        id: 'new-id',
        filename: 'test.jpg',
        caption: 'Test',
        album: 'Test Album',
        albumCover: false,
        albumOrdinality: '1',
        modificationInfo: MOCK_IMAGES[0].modificationInfo,
      };
      actions$.next(ImagesActions.addImageSucceeded({ image: baseImage }));

      effects.refetchMetadata$.subscribe(action => {
        expect(action).toEqual(ImagesActions.fetchAllImagesMetadataRequested());
        done();
      });
    });

    it('should trigger refetch after updateImageSucceeded', done => {
      const baseImage: BaseImage = {
        id: MOCK_IMAGES[0].id,
        filename: MOCK_IMAGES[0].filename,
        caption: 'Updated',
        album: MOCK_IMAGES[0].album,
        albumCover: false,
        albumOrdinality: '1',
        modificationInfo: MOCK_IMAGES[0].modificationInfo,
      };
      actions$.next(ImagesActions.updateImageSucceeded({ baseImage }));

      effects.refetchMetadata$.subscribe(action => {
        expect(action).toEqual(ImagesActions.fetchAllImagesMetadataRequested());
        done();
      });
    });

    it('should trigger refetch after deleteImageSucceeded', done => {
      actions$.next(ImagesActions.deleteImageSucceeded({ image: MOCK_IMAGES[0] }));

      effects.refetchMetadata$.subscribe(action => {
        expect(action).toEqual(ImagesActions.fetchAllImagesMetadataRequested());
        done();
      });
    });

    it('should trigger refetch when last fetch is expired', fakeAsync(() => {
      const expiredTimestamp = moment().subtract(10, 'minutes').toISOString();
      store.overrideSelector(ImagesSelectors.selectLastMetadataFetch, expiredTimestamp);
      store.refreshState();
      mockIsExpired.mockReturnValue(true);

      const results: Action[] = [];
      effects.refetchMetadata$.subscribe(action => {
        results.push(action);
      });

      tick(3000);
      tick(5 * 60 * 1000);

      expect(results[0]).toEqual(ImagesActions.fetchAllImagesMetadataRequested());
      expect(mockIsExpired).toHaveBeenCalledWith(expiredTimestamp);
    }));

    it('should not trigger refetch when last fetch is not expired', fakeAsync(() => {
      const recentTimestamp = moment().subtract(2, 'minutes').toISOString();
      store.overrideSelector(ImagesSelectors.selectLastMetadataFetch, recentTimestamp);
      store.refreshState();
      mockIsExpired.mockReturnValue(false);

      const results: Action[] = [];
      effects.refetchMetadata$.subscribe(action => {
        results.push(action);
      });

      tick(3000);
      tick(5 * 60 * 1000);

      expect(results).toHaveLength(0);
    }));
  });

  describe('updateImage$', () => {
    beforeEach(() => {
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();
    });

    it('should update image successfully', done => {
      const imageId = MOCK_IMAGES[0].id;
      const mockUpdateResponse: ApiResponse<string[]> = { data: [imageId] };

      imagesApiService.updateImages.mockReturnValue(of(mockUpdateResponse));

      actions$.next(ImagesActions.updateImageRequested({ imageId }));

      effects.updateImage$.subscribe(action => {
        expect(action.type).toBe(ImagesActions.updateImageSucceeded.type);
        const payload = action as ReturnType<typeof ImagesActions.updateImageSucceeded>;
        expect(payload.baseImage.id).toBe(imageId);
        expect(payload.baseImage.modificationInfo.lastEditedBy).toBe('Test User');
        expect(imagesApiService.updateImages).toHaveBeenCalled();
        done();
      });
    });

    it('should handle update image failure', done => {
      const imageId = MOCK_IMAGES[0].id;

      imagesApiService.updateImages.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(ImagesActions.updateImageRequested({ imageId }));

      effects.updateImage$.subscribe(action => {
        expect(action.type).toBe(ImagesActions.updateImageFailed.type);
        done();
      });
    });

    it('should not dispatch success if response ID does not match', done => {
      const imageId = MOCK_IMAGES[0].id;
      const mockUpdateResponse: ApiResponse<string[]> = { data: ['different-id'] };

      imagesApiService.updateImages.mockReturnValue(of(mockUpdateResponse));

      actions$.next(ImagesActions.updateImageRequested({ imageId }));

      const subscription = effects.updateImage$.subscribe(() => {
        done.fail('Should not dispatch action when IDs do not match');
      });

      setTimeout(() => {
        subscription.unsubscribe();
        done();
      }, 100);
    });
  });

  describe('deleteImage$', () => {
    it('should delete image successfully', done => {
      const mockDeleteResponse: ApiResponse<string> = { data: MOCK_IMAGES[0].id };
      imagesApiService.deleteImage.mockReturnValue(of(mockDeleteResponse));

      actions$.next(ImagesActions.deleteImageRequested({ image: MOCK_IMAGES[0] }));

      effects.deleteImage$.subscribe(action => {
        expect(action).toEqual(
          ImagesActions.deleteImageSucceeded({ image: MOCK_IMAGES[0] }),
        );
        expect(imagesApiService.deleteImage).toHaveBeenCalledWith(MOCK_IMAGES[0].id);
        done();
      });
    });

    it('should handle delete image failure', done => {
      imagesApiService.deleteImage.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(ImagesActions.deleteImageRequested({ image: MOCK_IMAGES[0] }));

      effects.deleteImage$.subscribe(action => {
        expect(action).toEqual(
          ImagesActions.deleteImageFailed({ image: MOCK_IMAGES[0], error: mockError }),
        );
        done();
      });
    });

    it('should not dispatch success if response ID does not match', done => {
      const mockDeleteResponse: ApiResponse<string> = { data: 'different-id' };
      imagesApiService.deleteImage.mockReturnValue(of(mockDeleteResponse));

      actions$.next(ImagesActions.deleteImageRequested({ image: MOCK_IMAGES[0] }));

      const subscription = effects.deleteImage$.subscribe(() => {
        done.fail('Should not dispatch action when IDs do not match');
      });

      setTimeout(() => {
        subscription.unsubscribe();
        done();
      }, 100);
    });
  });

  describe('deleteAlbum$', () => {
    it('should delete album successfully', done => {
      const albumName = 'Test Album';
      const imageIds = [MOCK_IMAGES[0].id, MOCK_IMAGES[1].id];
      const mockDeleteResponse: ApiResponse<string[]> = { data: imageIds };
      imagesApiService.deleteAlbum.mockReturnValue(of(mockDeleteResponse));

      actions$.next(ImagesActions.deleteAlbumRequested({ album: albumName }));

      effects.deleteAlbum$.subscribe(action => {
        expect(action).toEqual(
          ImagesActions.deleteAlbumSucceeded({ album: albumName, imageIds }),
        );
        expect(imagesApiService.deleteAlbum).toHaveBeenCalledWith(albumName);
        done();
      });
    });

    it('should handle delete album failure', done => {
      const albumName = 'Test Album';
      imagesApiService.deleteAlbum.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(ImagesActions.deleteAlbumRequested({ album: albumName }));

      effects.deleteAlbum$.subscribe(action => {
        expect(action).toEqual(
          ImagesActions.deleteAlbumFailed({ album: albumName, error: mockError }),
        );
        done();
      });
    });
  });
});
