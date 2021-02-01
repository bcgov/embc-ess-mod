import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CacheService {

    public get(key: string): string {
        return sessionStorage.getItem(key);
    }

    public set(key: string, value: any): void {
        sessionStorage.setItem(key, value);
    }

    public remove(key: string): void {
        sessionStorage.removeItem(key);
    }

    public clear(): void {
        sessionStorage.clear();
    }
}
