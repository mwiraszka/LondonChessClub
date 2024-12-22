import { Inject, Injectable, InjectionToken } from '@angular/core';

const LOCAL_STORAGE_TOKEN = new InjectionToken<Storage>('Local Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(@Inject(LOCAL_STORAGE_TOKEN) public storage: Storage) {}

  public get<T>(key: string): T | null {
    const storedValue = this.storage.getItem(key);
    return storedValue ? (JSON.parse(storedValue) as T) : null;
  }

  public set(key: string, value: any): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string): void {
    this.storage.removeItem(key);
  }
}
