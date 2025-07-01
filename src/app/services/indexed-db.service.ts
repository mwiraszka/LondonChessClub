import { Observable, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import type { ImageFormData, Url } from '@app/models';

const DB_NAME = 'LccImagesDB';
const DB_VERSION = 1;
const IMAGES_STORE = 'images';

@Injectable({ providedIn: 'root' })
export class IndexedDbService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDb();
  }

  public storeImage(imageData: {
    filename: string;
    album: string; // New album name/ the current album
    albums: string[]; // All other albums the image is in
    dataUrl: Url;
    caption: string;
  }): Observable<boolean> {
    return this.getDbConnection().pipe(
      switchMap(db => {
        return from(
          new Promise<boolean>((resolve, reject) => {
            const transaction = db.transaction([IMAGES_STORE], 'readwrite');
            const store = transaction.objectStore(IMAGES_STORE);

            const request = store.put({
              ...imageData,
              timestamp: Date.now(),
            });

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(false);
          }),
        );
      }),
      catchError(error => {
        console.error('[LCC] Error storing image in IndexedDB:', error);
        return of(false);
      }),
    );
  }

  public getAllImages(): Observable<ImageFormData[]> {
    return this.getDbConnection().pipe(
      switchMap(db => {
        return from(
          new Promise<ImageFormData[]>((resolve, reject) => {
            const transaction = db.transaction([IMAGES_STORE], 'readonly');
            const store = transaction.objectStore(IMAGES_STORE);
            const index = store.index('timestamp');

            // Get in descending order by timestamp
            const request = index.openCursor(null, 'prev');

            const images: ImageFormData[] = [];

            request.onsuccess = event => {
              const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;

              if (cursor) {
                images.push({
                  filename: cursor.value.filename,
                  albums: cursor.value.albums,
                  album: cursor.value.album,
                  dataUrl: cursor.value.dataUrl,
                  caption: cursor.value.caption,
                });
                cursor.continue();
              } else {
                resolve(images);
              }
            };

            request.onerror = () => {
              reject([]);
            };
          }),
        );
      }),
      catchError(error => {
        console.error('[LCC] Error retrieving images from IndexedDB:', error);
        return of([]);
      }),
    );
  }

  public deleteImage(filename: string): Observable<boolean> {
    return this.getDbConnection().pipe(
      switchMap(db => {
        return from(
          new Promise<boolean>((resolve, reject) => {
            const transaction = db.transaction([IMAGES_STORE], 'readwrite');
            const store = transaction.objectStore(IMAGES_STORE);
            const request = store.delete(filename);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(false);
          }),
        );
      }),
      catchError(error => {
        console.error('[LCC] Error deleting image from IndexedDB:', error);
        return of(false);
      }),
    );
  }

  public clearAllImages(): Observable<boolean> {
    return this.getDbConnection().pipe(
      switchMap(db => {
        return from(
          new Promise<boolean>((resolve, reject) => {
            const transaction = db.transaction([IMAGES_STORE], 'readwrite');
            const store = transaction.objectStore(IMAGES_STORE);
            const request = store.clear();

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(false);
          }),
        );
      }),
      catchError(error => {
        console.error('[LCC] Error clearing images from IndexedDB:', error);
        return of(false);
      }),
    );
  }

  private initDb(): void {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        const objectStore = db.createObjectStore(IMAGES_STORE, { keyPath: 'filename' });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = event => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    request.onerror = event => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
    };
  }

  private getDbConnection(): Observable<IDBDatabase> {
    if (this.db) {
      return of(this.db);
    }

    return from(
      new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = event => {
          this.db = (event.target as IDBOpenDBRequest).result;
          resolve(this.db);
        };

        request.onerror = event => {
          reject((event.target as IDBOpenDBRequest).error);
        };
      }),
    );
  }
}
