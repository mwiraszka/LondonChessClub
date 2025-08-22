import { Article, EntityType, Event, Image, LccError, Member } from '@app/models';

import { exportDataToCsv } from './export-data-to-csv.util';

describe('exportDataToCsv', () => {
  let createElementSpy: jest.SpyInstance;
  let clickSpy: jest.Mock;
  let setAttributeSpy: jest.Mock;
  let mockLink: HTMLAnchorElement;
  let appendChildSpy: jest.SpyInstance;
  let removeChildSpy: jest.SpyInstance;
  let blobSpy: jest.SpyInstance;

  beforeEach(() => {
    clickSpy = jest.fn();
    setAttributeSpy = jest.fn();

    mockLink = {
      href: '',
      setAttribute: setAttributeSpy,
      click: clickSpy,
      download: '',
      style: {} as CSSStyleDeclaration,
    } as unknown as HTMLAnchorElement;

    createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
    appendChildSpy = jest
      .spyOn(document.body, 'appendChild')
      .mockImplementation(() => mockLink);
    removeChildSpy = jest
      .spyOn(document.body, 'removeChild')
      .mockImplementation(() => mockLink);

    // Mock URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');

    // Mock Blob constructor
    blobSpy = jest.spyOn(window, 'Blob').mockImplementation((content, options) => {
      return { content, options } as unknown as Blob;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should export Member data to CSV successfully', () => {
    const mockMembers: Member[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        rating: '2100',
        peakRating: '2150',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        city: 'London',
        yearOfBirth: '1990',
        chessComUsername: 'johndoe',
        lichessUsername: 'johndoe123',
        isActive: true,
        dateJoined: '2024-01-01T00:00:00.000Z',
        modificationInfo: {
          createdBy: 'admin',
          dateCreated: '2024-01-01T00:00:00.000Z',
          lastEditedBy: 'admin',
          dateLastEdited: '2024-01-01T00:00:00.000Z',
        },
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        rating: '1900',
        peakRating: '1950',
        email: 'jane@example.com',
        phoneNumber: '0987654321',
        city: 'Manchester',
        yearOfBirth: '1985',
        chessComUsername: 'janesmith',
        lichessUsername: 'janesmith456',
        isActive: false,
        dateJoined: '2023-06-15T00:00:00.000Z',
        modificationInfo: {
          createdBy: 'admin',
          dateCreated: '2023-06-15T00:00:00.000Z',
          lastEditedBy: 'admin',
          dateLastEdited: '2023-06-15T00:00:00.000Z',
        },
      },
    ];

    const result = exportDataToCsv(mockMembers, 'members-export.csv');

    expect(result).toBe(2);
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(window.Blob).toHaveBeenCalledWith([expect.any(String)], {
      type: 'text/csv;charset=utf-8;',
    });
    expect(setAttributeSpy).toHaveBeenCalledWith('download', 'members-export.csv');
    expect(clickSpy).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
    expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
  });

  it('should export Article data to CSV successfully', () => {
    const mockArticles: Article[] = [
      {
        id: 'art1',
        title: 'Chess Opening Theory',
        body: 'An in-depth analysis of chess openings',
        bannerImageId: 'img1',
        bookmarkDate: null,
        modificationInfo: {
          createdBy: 'author1',
          dateCreated: '2024-01-01T00:00:00.000Z',
          lastEditedBy: 'author1',
          dateLastEdited: '2024-01-01T00:00:00.000Z',
        },
      },
    ];

    const result = exportDataToCsv(mockArticles, 'articles.csv');

    expect(result).toBe(1);
    expect(createElementSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should export Event data to CSV successfully', () => {
    const mockEvents: Event[] = [
      {
        id: 'evt1',
        type: 'blitz tournament (10 mins)',
        eventDate: '2024-03-15T19:00:00.000Z',
        title: 'March Blitz Tournament',
        details: 'Monthly blitz tournament open to all members',
        articleId: null,
        modificationInfo: {
          createdBy: 'organizer',
          dateCreated: '2024-02-01T00:00:00.000Z',
          lastEditedBy: 'organizer',
          dateLastEdited: '2024-02-01T00:00:00.000Z',
        },
      },
      {
        id: 'evt2',
        type: 'lecture',
        eventDate: '2024-03-20T18:30:00.000Z',
        title: 'Endgame Mastery',
        details: 'Guest lecture on advanced endgame techniques',
        articleId: 'art2',
        modificationInfo: {
          createdBy: 'organizer',
          dateCreated: '2024-02-05T00:00:00.000Z',
          lastEditedBy: 'organizer',
          dateLastEdited: '2024-02-05T00:00:00.000Z',
        },
      },
    ];

    const result = exportDataToCsv(mockEvents, 'events-schedule.csv');

    expect(result).toBe(2);
    expect(setAttributeSpy).toHaveBeenCalledWith('download', 'events-schedule.csv');
  });

  it('should export Image data to CSV successfully', () => {
    const mockImages: Image[] = [
      {
        id: 'img1',
        filename: 'tournament-photo.jpg',
        caption: 'Tournament participants',
        album: 'March 2024 Tournament',
        albumCover: true,
        albumOrdinality: '1',
        originalUrl: 'https://example.com/original/tournament-photo.jpg',
        thumbnailUrl: 'https://example.com/thumb/tournament-photo.jpg',
        urlExpirationDate: '2024-12-31T23:59:59.999Z',
        width: 1920,
        height: 1080,
        fileSize: 2048000,
        articleAppearances: 3,
        modificationInfo: {
          createdBy: 'photographer',
          dateCreated: '2024-03-15T20:00:00.000Z',
          lastEditedBy: 'photographer',
          dateLastEdited: '2024-03-15T20:00:00.000Z',
        },
      },
    ];

    const result = exportDataToCsv(mockImages, 'photos.csv');

    expect(result).toBe(1);
    expect(createElementSpy).toHaveBeenCalled();
  });

  it('should handle empty data array', () => {
    const mockData: EntityType[] = [];

    const result = exportDataToCsv(mockData, 'empty.csv');

    expect(result).toEqual({
      name: 'LCCError',
      message: 'No data available for export',
    } as LccError);

    expect(window.Blob).not.toHaveBeenCalled();
    expect(createElementSpy).not.toHaveBeenCalled();
  });

  it('should handle errors during export', () => {
    blobSpy.mockImplementation(() => {
      throw new Error('Blob creation failed');
    });

    const mockData: Member[] = [
      {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        rating: '1500',
        peakRating: '1500',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        city: 'London',
        yearOfBirth: '2000',
        chessComUsername: 'testuser',
        lichessUsername: 'testuser',
        isActive: true,
        dateJoined: '2024-01-01T00:00:00.000Z',
        modificationInfo: {
          createdBy: 'admin',
          dateCreated: '2024-01-01T00:00:00.000Z',
          lastEditedBy: 'admin',
          dateLastEdited: '2024-01-01T00:00:00.000Z',
        },
      },
    ];

    const result = exportDataToCsv(mockData, 'error-test.csv');

    expect(result).toEqual({
      name: 'LCCError',
      message: 'Unknown error occurred while exporting data to CSV',
    } as LccError);
  });

  it('should handle large datasets', () => {
    const mockData: Member[] = Array.from({ length: 1000 }, (_, i) => ({
      id: `${i + 1}`,
      firstName: `User${i + 1}`,
      lastName: `Lastname${i + 1}`,
      rating: `${1500 + (i % 500)}`,
      peakRating: `${1550 + (i % 500)}`,
      email: `user${i + 1}@example.com`,
      phoneNumber: `555${String(i).padStart(7, '0')}`,
      city: i % 2 === 0 ? 'London' : 'Manchester',
      yearOfBirth: `${1980 + (i % 40)}`,
      chessComUsername: `user${i + 1}`,
      lichessUsername: `user${i + 1}lich`,
      isActive: i % 3 !== 0,
      dateJoined: new Date(2020, i % 12, (i % 28) + 1).toISOString(),
      modificationInfo: {
        createdBy: 'admin',
        dateCreated: new Date(2020, i % 12, (i % 28) + 1).toISOString(),
        lastEditedBy: 'admin',
        dateLastEdited: new Date(2020, i % 12, (i % 28) + 1).toISOString(),
      },
    }));

    const result = exportDataToCsv(mockData, 'large-dataset.csv');

    expect(result).toBe(1000);
    expect(window.Blob).toHaveBeenCalled();
    expect(createElementSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should handle boolean and numeric values correctly', () => {
    const mockData: Image[] = [
      {
        id: 'img123',
        filename: 'test.jpg',
        caption: 'Test Image',
        album: 'Test Album',
        albumCover: true,
        albumOrdinality: '1',
        width: 1920,
        height: 1080,
        fileSize: 2048000,
        articleAppearances: 0,
        modificationInfo: {
          createdBy: 'user',
          dateCreated: '2024-01-01T00:00:00.000Z',
          lastEditedBy: 'user',
          dateLastEdited: '2024-01-01T00:00:00.000Z',
        },
      },
    ];

    const result = exportDataToCsv(mockData, 'types-test.csv');

    expect(result).toBe(1);
    const blobCall = blobSpy.mock.calls[blobSpy.mock.calls.length - 1];
    const csvContent = blobCall[0][0] as string;

    expect(csvContent).toContain('true');
    expect(csvContent).toContain('1920');
    expect(csvContent).toContain('1080');
    expect(csvContent).toContain('2048000');
    expect(csvContent).toContain('0');
  });
});
