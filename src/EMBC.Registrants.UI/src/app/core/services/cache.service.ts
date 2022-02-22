import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CacheService {
  // public get<T>(key: string): T {
  //   return JSON.parse(sessionStorage.getItem(key));
  // }
  public get(key: string): string {
    return sessionStorage.getItem(key);
  }

  public set<T>(key: string, value: T): void {
    if (typeof value === 'string') {
      sessionStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
    //sessionStorage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  public clear(): void {
    sessionStorage.clear();
  }
}
