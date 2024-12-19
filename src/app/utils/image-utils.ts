import * as uuid from 'uuid';

import { Image } from '@app/types';

export function generatePlaceholderImages(count: number): Image[] {
  return Array(count).map(() => ({
    articleAppearances: 0,
    dateUploaded: new Date().toISOString(),
    id: uuid.v4(),
    presignedUrl: '',
    size: 0,
  }));
}
