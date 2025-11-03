import { TestBed } from '@angular/core/testing';

import { ImageFileService } from './image-file.service';

describe('ImageFileService', () => {
  let service: ImageFileService;

  beforeEach(() => {
    const mockIndexedDB = {
      open: jest.fn().mockReturnValue({
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null,
        result: null,
      }),
    };

    Object.defineProperty(window, 'indexedDB', {
      writable: true,
      value: mockIndexedDB,
    });

    TestBed.configureTestingModule({
      providers: [ImageFileService],
    });

    service = TestBed.inject(ImageFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('file validation', () => {
    it('should reject unsupported file types', async () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' });

      const result = await service.storeImageFile('test-id', file);

      expect(result).toEqual({
        name: 'LCCError',
        message: expect.stringContaining('unsupported'),
      });
    });

    it('should reject BMP files', async () => {
      const file = new File(['test'], 'test.bmp', { type: 'image/bmp' });

      const result = await service.storeImageFile('test-id', file);

      expect(result).toEqual({
        name: 'LCCError',
        message: expect.stringContaining('unsupported'),
      });
    });

    it('should reject SVG files', async () => {
      const file = new File(['test'], 'test.svg', { type: 'image/svg+xml' });

      const result = await service.storeImageFile('test-id', file);

      expect(result).toEqual({
        name: 'LCCError',
        message: expect.stringContaining('unsupported'),
      });
    });
  });
});
