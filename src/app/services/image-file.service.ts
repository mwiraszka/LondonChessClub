import { Injectable } from '@angular/core';

import { type LccError, type Url, isLccError } from '@app/models';
import { dataUrlToFile, formatBytes } from '@app/utils';

const DB_NAME = 'LccImagesDB';
const DB_VERSION = 1;
const IMAGES_STORE = 'images';

@Injectable({
  providedIn: 'root',
})
export class ImageFileService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDb();
  }

  public async storeImageFile(
    file: File,
    clearAllOthers = false,
  ): Promise<{ dataUrl: Url; filename: string } | LccError> {
    const fileProcessResult = this.processFile(file);

    if (isLccError(fileProcessResult)) {
      return fileProcessResult;
    }

    if (clearAllOthers) {
      const clearResult = await this.clearAllImages();

      if (isLccError(clearResult)) {
        return clearResult;
      }
    }

    const { filename, dataUrl } = fileProcessResult;

    try {
      const db = await this.getDbConnection();

      return new Promise<{ dataUrl: Url; filename: string } | LccError>(resolve => {
        const transaction = db.transaction([IMAGES_STORE], 'readwrite');
        const store = transaction.objectStore(IMAGES_STORE);
        const request = store.put({ filename, dataUrl });

        request.onsuccess = () => {
          resolve({ filename, dataUrl });
        };

        request.onerror = event => {
          resolve({
            name: 'LCCError',
            message: `Error storing image file in IndexedDB:
              ${(event.target as IDBRequest).error}`,
          });
        };

        transaction.onerror = event => {
          resolve({
            name: 'LCCError',
            message: `Error in transaction when storing image file in IndexedDB:
              ${(event.target as IDBRequest).error}`,
          });
        };
      });
    } catch (error) {
      return {
        name: 'LCCError',
        message: `Error storing image file in IndexedDB: ${error}`,
      };
    }
  }

  public async getImage(
    filename: string,
  ): Promise<{ filename: string; dataUrl: Url } | LccError> {
    try {
      const db = await this.getDbConnection();

      return new Promise<{ filename: string; dataUrl: Url } | LccError>(resolve => {
        const transaction = db.transaction([IMAGES_STORE], 'readonly');
        const store = transaction.objectStore(IMAGES_STORE);

        const request = store.get(filename);

        request.onsuccess = () => {
          resolve(request.result as { filename: string; dataUrl: Url });
        };

        request.onerror = event => {
          resolve({
            name: 'LCCError',
            message: `Error in cursor request when retrieving ${filename} image from IndexedDB:
              ${(event.target as IDBRequest).error}`,
          });
        };

        transaction.onerror = event => {
          resolve({
            name: 'LCCError',
            message: `Error in transaction when retrieving ${filename} image from IndexedDB:
              ${(event.target as IDBRequest).error}`,
          });
        };
      });
    } catch (error) {
      return {
        name: 'LCCError',
        message: `Error retrieving ${filename} image from IndexedDB: ${error}`,
      };
    }
  }

  public async getAllImages(): Promise<{ filename: string; dataUrl: Url }[] | LccError> {
    try {
      const db = await this.getDbConnection();

      return new Promise<{ filename: string; dataUrl: Url }[] | LccError>(resolve => {
        const transaction = db.transaction([IMAGES_STORE], 'readonly');
        const store = transaction.objectStore(IMAGES_STORE);

        const request = store.openCursor();

        const images: { filename: string; dataUrl: Url }[] = [];

        request.onsuccess = event => {
          const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
          if (cursor) {
            images.push({
              filename: cursor.value.filename,
              dataUrl: cursor.value.dataUrl,
            });
            cursor.continue();
          } else {
            resolve(images);
          }
        };

        request.onerror = event => {
          resolve({
            name: 'LCCError',
            message: `Error in IndexedDB cursor request:
              ${(event.target as IDBRequest).error}`,
          });
        };

        transaction.onerror = event => {
          resolve({
            name: 'LCCError',
            message: `Error in transaction when retrieving images from IndexedDB:
              ${(event.target as IDBRequest).error}`,
          });
        };
      });
    } catch (error) {
      return {
        name: 'LCCError',
        message: `Error retrieving images from IndexedDB: ${error}`,
      };
    }
  }

  public async deleteImage(filename: string): Promise<'success' | LccError> {
    try {
      const db = await this.getDbConnection();

      return new Promise<'success' | LccError>(resolve => {
        const transaction = db.transaction([IMAGES_STORE], 'readwrite');
        const store = transaction.objectStore(IMAGES_STORE);

        const request = store.delete(filename);

        request.onsuccess = () => resolve('success');
        request.onerror = event => {
          resolve({
            name: 'LCCError',
            message: `Error in IndexedDB delete request:
              ${(event.target as IDBRequest).error}`,
          });
        };

        transaction.onerror = event => {
          resolve({
            name: 'LCCError',
            message: `Error in transaction when deleting image from IndexedDB:
              ${(event.target as IDBRequest).error}`,
          });
        };
      });
    } catch (error) {
      return {
        name: 'LCCError',
        message: `Error deleting image from IndexedDB: ${error}`,
      };
    }
  }

  public async clearAllImages(): Promise<'success' | LccError> {
    try {
      const db = await this.getDbConnection();

      return new Promise<'success' | LccError>(resolve => {
        const transaction = db.transaction([IMAGES_STORE], 'readwrite');
        const store = transaction.objectStore(IMAGES_STORE);

        const request = store.clear();

        request.onsuccess = () => resolve('success');
        request.onerror = event => {
          resolve({
            name: 'LCCError',
            message: `Error in IndexedDB clear request:
            ${(event.target as IDBRequest).error}`,
          });
        };

        transaction.onerror = event => {
          resolve({
            name: 'LCCError',
            message: `Error in transaction when clearing images from IndexedDB:
              ${(event.target as IDBRequest).error}`,
          });
        };
      });
    } catch (error) {
      return {
        name: 'LCCError',
        message: `Error clearing images from IndexedDB: ${error}`,
      };
    }
  }

  private initDb(): void {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE, { keyPath: 'filename' });
      }
    };

    request.onsuccess = event => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    request.onerror = event => {
      console.error(
        '[LCC] Error while initializing IndexedDB:',
        (event.target as IDBOpenDBRequest).error,
      );
    };
  }

  private async getDbConnection(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onsuccess = event => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = event => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  private processFile(file: File): { dataUrl: Url; filename: string } | LccError {
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type.toLowerCase())) {
      return {
        name: 'LCCError',
        message: 'Sorry Ryan, currently only PNG or JPEG image formats are supported',
      };
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const dataUrl = reader.result as Url;

      const sanitizedFilename =
        file.name
          .substring(0, file.name.lastIndexOf('.'))
          .replaceAll(/[^a-zA-Z0-9-_]/g, '') +
        file.name.substring(file.name.lastIndexOf('.'));

      const processedFile = dataUrlToFile(dataUrl, sanitizedFilename);

      if (!processedFile) {
        return {
          name: 'LCCError',
          message: 'Unable to load image file',
        };
      }

      if (processedFile.size > 1_258_291) {
        return {
          name: 'LCCError',
          message: `Image is too large (${formatBytes(processedFile.size)}) - please reduce to below 1.2 MB`,
        };
      }

      return { dataUrl, filename: processedFile.name };
    };

    const error: LccError = {
      name: 'LCCError',
      message: 'Unable to process image file',
    };
    return error;
  }
}
