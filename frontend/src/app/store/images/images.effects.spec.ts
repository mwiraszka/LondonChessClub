import { provideMockActions } from '@ngrx/effects/testing';
import { Action, createSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import moment from 'moment-timezone';
import { ReplaySubject, of, throwError } from 'rxjs';

import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { INITIAL_IMAGE_FORM_DATA } from '@app/constants';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import {
  ApiResponse,
  BaseImage,
  Id,
  Image,
  LccError,
  PaginatedItems,
  User,
} from '@app/models';
import { ImageFileService, ImagesApiService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';

import { ImagesActions, ImagesSelectors } from '.';
import { ImagesEffects } from './images.effects';

const mockBuildImagesFormData = jest.fn();
const mockParseError = jest.fn();
const mockIsExpired = jest.fn();
const mockDataUrlToFile = jest.fn();
const mockIsLccError = jest.fn();

jest.mock('@app/utils', () => ({
  buildImagesFormData: (...args: unknown[]) => mockBuildImagesFormData(...args),
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
    mockBuildImagesFormData.mockReturnValue(new FormData());
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
      const mockUpdateResponse: ApiResponse<{
        newImages: Image[];
        updatedImages: BaseImage[];
      }> = {
        data: {
          newImages: [],
          updatedImages: [
            {
              id: MOCK_IMAGES[0].id,
              filename: MOCK_IMAGES[0].filename,
              caption: MOCK_IMAGES[0].caption,
              album: MOCK_IMAGES[0].album,
              albumCover: MOCK_IMAGES[0].albumCover,
              albumOrdinality: MOCK_IMAGES[0].albumOrdinality,
              modificationInfo: MOCK_IMAGES[0].modificationInfo,
            },
          ],
        },
      };

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

    it('should fail when response counts do not match expected values', done => {
      const imageId = MOCK_IMAGES[0].id;
      const mockUpdateResponse: ApiResponse<{
        newImages: Image[];
        updatedImages: BaseImage[];
      }> = {
        data: {
          newImages: [MOCK_IMAGES[0]], // Expected 0
          updatedImages: [],
        },
      };

      imagesApiService.updateImages.mockReturnValue(of(mockUpdateResponse));

      actions$.next(ImagesActions.updateImageRequested({ imageId }));

      effects.updateImage$.subscribe(action => {
        expect(action.type).toBe(ImagesActions.updateImageFailed.type);
        const payload = action as ReturnType<typeof ImagesActions.updateImageFailed>;
        expect(payload.error.message).toContain(
          'Expected 0 images to be added and 1 image to be updated',
        );
        done();
      });
    });

    it('should build FormData with existing image', done => {
      const imageId = MOCK_IMAGES[0].id;
      const mockUpdateResponse: ApiResponse<{
        newImages: Image[];
        updatedImages: BaseImage[];
      }> = {
        data: {
          newImages: [],
          updatedImages: [
            {
              id: MOCK_IMAGES[0].id,
              filename: MOCK_IMAGES[0].filename,
              caption: MOCK_IMAGES[0].caption,
              album: MOCK_IMAGES[0].album,
              albumCover: MOCK_IMAGES[0].albumCover,
              albumOrdinality: MOCK_IMAGES[0].albumOrdinality,
              modificationInfo: MOCK_IMAGES[0].modificationInfo,
            },
          ],
        },
      };

      imagesApiService.updateImages.mockReturnValue(of(mockUpdateResponse));

      actions$.next(ImagesActions.updateImageRequested({ imageId }));

      effects.updateImage$.subscribe(action => {
        expect(action.type).toBe(ImagesActions.updateImageSucceeded.type);
        const callArg = imagesApiService.updateImages.mock.calls[0][0];
        expect(callArg).toBeInstanceOf(FormData);
        done();
      });
    });
  });

  describe('updateAlbum$', () => {
    const album = 'Test Album';
    const mockIndexedDbData = [
      { id: 'new-1', filename: 'new1.jpg', dataUrl: 'data:image/jpeg;base64,abc' },
      { id: 'new-2', filename: 'new2.jpg', dataUrl: 'data:image/jpeg;base64,def' },
    ];
    let mockImageFileService: jest.Mocked<ImageFileService>;

    beforeEach(() => {
      mockImageFileService = TestBed.inject(
        ImageFileService,
      ) as jest.Mocked<ImageFileService>;
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.overrideSelector(ImagesSelectors.selectNewImagesFormData, {
        'new-1': { ...INITIAL_IMAGE_FORM_DATA, id: 'new-1', album },
        'new-2': { ...INITIAL_IMAGE_FORM_DATA, id: 'new-2', album },
      });
      store.refreshState();
      mockIsLccError.mockReturnValue(false);
      mockDataUrlToFile.mockReturnValue(new File([''], 'test.jpg'));
    });

    it('should update album with new and existing images successfully', done => {
      const newImages = [
        { ...MOCK_IMAGES[0], id: 'new-1', filename: 'new1.jpg' },
        { ...MOCK_IMAGES[1], id: 'new-2', filename: 'new2.jpg' },
      ];
      const updatedImages: BaseImage[] = [
        {
          id: MOCK_IMAGES[0].id,
          filename: MOCK_IMAGES[0].filename,
          caption: MOCK_IMAGES[0].caption,
          album: MOCK_IMAGES[0].album,
          albumCover: MOCK_IMAGES[0].albumCover,
          albumOrdinality: MOCK_IMAGES[0].albumOrdinality,
          modificationInfo: MOCK_IMAGES[0].modificationInfo,
        },
      ];

      jest.spyOn(ImagesSelectors, 'selectImageEntitiesByAlbum').mockReturnValue(
        createSelector(() => [
          {
            image: MOCK_IMAGES[0],
            formData: {
              id: MOCK_IMAGES[0].id,
              filename: MOCK_IMAGES[0].filename,
              caption: MOCK_IMAGES[0].caption,
              album: MOCK_IMAGES[0].album,
              albumCover: MOCK_IMAGES[0].albumCover,
              albumOrdinality: MOCK_IMAGES[0].albumOrdinality,
            },
          },
        ]) as ReturnType<typeof ImagesSelectors.selectImageEntitiesByAlbum>,
      );

      const mockUpdateResponse: ApiResponse<{
        newImages: Image[];
        updatedImages: BaseImage[];
      }> = {
        data: { newImages, updatedImages },
      };

      mockImageFileService.getAllImages.mockReturnValue(
        Promise.resolve(mockIndexedDbData),
      );
      imagesApiService.updateImages.mockReturnValue(of(mockUpdateResponse));

      actions$.next(ImagesActions.updateAlbumRequested({ album }));

      effects.updateAlbum$.subscribe(action => {
        expect(action.type).toBe(ImagesActions.updateAlbumSucceeded.type);
        const payload = action as ReturnType<typeof ImagesActions.updateAlbumSucceeded>;
        expect(payload.album).toBe(album);
        expect(payload.newImages.length).toBe(2);
        expect(payload.updatedImages.length).toBe(1);
        expect(imagesApiService.updateImages).toHaveBeenCalled();
        done();
      });
    });

    it('should handle update album failure from API', done => {
      jest.spyOn(ImagesSelectors, 'selectImageEntitiesByAlbum').mockReturnValue(
        createSelector(() => [
          {
            image: MOCK_IMAGES[0],
            formData: {
              id: MOCK_IMAGES[0].id,
              filename: MOCK_IMAGES[0].filename,
              caption: MOCK_IMAGES[0].caption,
              album: MOCK_IMAGES[0].album,
              albumCover: MOCK_IMAGES[0].albumCover,
              albumOrdinality: MOCK_IMAGES[0].albumOrdinality,
            },
          },
        ]) as ReturnType<typeof ImagesSelectors.selectImageEntitiesByAlbum>,
      );

      mockImageFileService.getAllImages.mockReturnValue(
        Promise.resolve(mockIndexedDbData),
      );
      imagesApiService.updateImages.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(ImagesActions.updateAlbumRequested({ album }));

      effects.updateAlbum$.subscribe(action => {
        expect(action.type).toBe(ImagesActions.updateAlbumFailed.type);
        done();
      });
    });

    it('should fail when response counts do not match', done => {
      jest.spyOn(ImagesSelectors, 'selectImageEntitiesByAlbum').mockReturnValue(
        createSelector(() => [
          {
            image: MOCK_IMAGES[0],
            formData: {
              id: MOCK_IMAGES[0].id,
              filename: MOCK_IMAGES[0].filename,
              caption: MOCK_IMAGES[0].caption,
              album: MOCK_IMAGES[0].album,
              albumCover: MOCK_IMAGES[0].albumCover,
              albumOrdinality: MOCK_IMAGES[0].albumOrdinality,
            },
          },
        ]) as ReturnType<typeof ImagesSelectors.selectImageEntitiesByAlbum>,
      );

      const mockUpdateResponse: ApiResponse<{
        newImages: Image[];
        updatedImages: BaseImage[];
      }> = {
        data: {
          newImages: [MOCK_IMAGES[0]], // Only 1, expected 2
          updatedImages: [
            {
              id: MOCK_IMAGES[0].id,
              filename: MOCK_IMAGES[0].filename,
              caption: MOCK_IMAGES[0].caption,
              album: MOCK_IMAGES[0].album,
              albumCover: MOCK_IMAGES[0].albumCover,
              albumOrdinality: MOCK_IMAGES[0].albumOrdinality,
              modificationInfo: MOCK_IMAGES[0].modificationInfo,
            },
          ],
        },
      };

      mockImageFileService.getAllImages.mockReturnValue(
        Promise.resolve(mockIndexedDbData),
      );
      imagesApiService.updateImages.mockReturnValue(of(mockUpdateResponse));

      actions$.next(ImagesActions.updateAlbumRequested({ album }));

      effects.updateAlbum$.subscribe(action => {
        expect(action.type).toBe(ImagesActions.updateAlbumFailed.type);
        const payload = action as ReturnType<typeof ImagesActions.updateAlbumFailed>;
        expect(payload.error.message).toContain('Expected 2 images to be added');
        done();
      });
    });

    it('should fail when form data is missing for an image', done => {
      jest.spyOn(ImagesSelectors, 'selectImageEntitiesByAlbum').mockReturnValue(
        createSelector(() => [
          {
            image: MOCK_IMAGES[0],
            formData: {
              id: MOCK_IMAGES[0].id,
              filename: MOCK_IMAGES[0].filename,
              caption: MOCK_IMAGES[0].caption,
              album: MOCK_IMAGES[0].album,
              albumCover: MOCK_IMAGES[0].albumCover,
              albumOrdinality: MOCK_IMAGES[0].albumOrdinality,
            },
          },
        ]) as ReturnType<typeof ImagesSelectors.selectImageEntitiesByAlbum>,
      );
      store.overrideSelector(ImagesSelectors.selectNewImagesFormData, {
        'new-1': { ...INITIAL_IMAGE_FORM_DATA, id: 'new-1', album },
        // Missing 'new-2' form data
      });
      store.refreshState();

      mockImageFileService.getAllImages.mockReturnValue(
        Promise.resolve(mockIndexedDbData),
      );

      actions$.next(ImagesActions.updateAlbumRequested({ album }));

      effects.updateAlbum$.subscribe(action => {
        expect(action.type).toBe(ImagesActions.updateAlbumFailed.type);
        const payload = action as ReturnType<typeof ImagesActions.updateAlbumFailed>;
        expect(payload.error.message).toBe(
          'Mismatch between image file data and form data',
        );
        done();
      });
    });
  });

  describe('automaticallyUpdateAlbumCoverAfterImageDeletion$', () => {
    const album = 'Test Album';
    const deletedImage = { ...MOCK_IMAGES[0], albumCover: true };
    const newCoverImage = { ...MOCK_IMAGES[1], album, albumCover: false };

    beforeEach(() => {
      jest
        .spyOn(ImagesSelectors, 'selectImagesByAlbum')
        .mockReturnValue(
          createSelector(() => [newCoverImage]) as ReturnType<
            typeof ImagesSelectors.selectImagesByAlbum
          >,
        );
    });

    it('should automatically set new album cover after deleting current cover', done => {
      const mockUpdateResponse: ApiResponse<{
        newImages: Image[];
        updatedImages: BaseImage[];
      }> = {
        data: {
          newImages: [],
          updatedImages: [
            {
              id: newCoverImage.id,
              filename: newCoverImage.filename,
              caption: newCoverImage.caption,
              album: newCoverImage.album,
              albumCover: true,
              albumOrdinality: newCoverImage.albumOrdinality,
              modificationInfo: newCoverImage.modificationInfo,
            },
          ],
        },
      };

      imagesApiService.updateImages.mockReturnValue(of(mockUpdateResponse));

      actions$.next(ImagesActions.deleteImageSucceeded({ image: deletedImage }));

      effects.automaticallyUpdateAlbumCoverAfterImageDeletion$.subscribe(action => {
        expect(action.type).toBe(ImagesActions.automaticAlbumCoverSwitchSucceeded.type);
        const payload = action as ReturnType<
          typeof ImagesActions.automaticAlbumCoverSwitchSucceeded
        >;
        expect(payload.baseImage.id).toBe(newCoverImage.id);
        expect(payload.baseImage.albumCover).toBe(true);
        done();
      });
    });

    it('should not trigger when deleted image is not album cover', done => {
      const nonCoverImage = { ...MOCK_IMAGES[0], albumCover: false };

      actions$.next(ImagesActions.deleteImageSucceeded({ image: nonCoverImage }));

      const subscription =
        effects.automaticallyUpdateAlbumCoverAfterImageDeletion$.subscribe(() => {
          done.fail('Should not dispatch action when deleted image is not album cover');
        });

      setTimeout(() => {
        subscription.unsubscribe();
        done();
      }, 100);
    });

    it('should handle update failure with error counts mismatch', done => {
      const mockUpdateResponse: ApiResponse<{
        newImages: Image[];
        updatedImages: BaseImage[];
      }> = {
        data: {
          newImages: [MOCK_IMAGES[0]], // Expected 0, got 1
          updatedImages: [],
        },
      };

      imagesApiService.updateImages.mockReturnValue(of(mockUpdateResponse));

      actions$.next(ImagesActions.deleteImageSucceeded({ image: deletedImage }));

      effects.automaticallyUpdateAlbumCoverAfterImageDeletion$.subscribe(action => {
        expect(action.type).toBe(ImagesActions.automaticAlbumCoverSwitchFailed.type);
        const payload = action as ReturnType<
          typeof ImagesActions.automaticAlbumCoverSwitchFailed
        >;
        expect(payload.error.message).toContain(
          'Expected 0 images to be added and 1 image to be updated',
        );
        done();
      });
    });

    it('should handle API failure', done => {
      imagesApiService.updateImages.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(ImagesActions.deleteImageSucceeded({ image: deletedImage }));

      effects.automaticallyUpdateAlbumCoverAfterImageDeletion$.subscribe(action => {
        expect(action.type).toBe(ImagesActions.automaticAlbumCoverSwitchFailed.type);
        done();
      });
    });
  });

  describe('deleteImage$', () => {
    it('should delete image successfully', done => {
      const mockDeleteResponse: ApiResponse<Id> = { data: MOCK_IMAGES[0].id };
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
      const mockDeleteResponse: ApiResponse<Id> = { data: 'different-id' };
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
      const mockDeleteResponse: ApiResponse<Id[]> = { data: imageIds };
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
