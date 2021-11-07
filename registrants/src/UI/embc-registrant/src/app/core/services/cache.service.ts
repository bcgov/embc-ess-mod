import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CacheService {
  public get<T>(key: string): T {
    return JSON.parse(sessionStorage.getItem(key));
  }

  public set<T>(key: string, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  public clear(): void {
    sessionStorage.clear();
  }
}
