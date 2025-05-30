import { Image } from '../models/image.model';

export const MOCK_IMAGES: Image[] = [
  {
    id: '1',
    filename: 'image1.jpg',
    fileSize: 123456,
    caption: 'Image 1',
    articleAppearances: 1,
    thumbnailPresignedUrl: 'https://example.com/image1-thumb.jpg',
    albums: [],
    coverForAlbum: null,
    modificationInfo: {
      createdBy: 'John Doe',
      dateCreated: '2023-01-01T00:00:00Z',
      lastEditedBy: 'John Doe',
      dateLastEdited: '2023-01-01T00:00:00Z',
    },
  },
  {
    id: '2',
    filename: 'image2.jpg',
    fileSize: 234567,
    caption: 'Image 2',
    articleAppearances: 2,
    originalPresignedUrl: 'https://example.com/image2.jpg',
    thumbnailPresignedUrl: 'https://example.com/image2-thumb.jpg',
    albums: [],
    coverForAlbum: null,
    modificationInfo: {
      createdBy: 'Jane Smith',
      dateCreated: '2023-02-01T00:00:00Z',
      lastEditedBy: 'Jane Smith',
      dateLastEdited: '2023-02-01T00:00:00Z',
    },
  },
];
