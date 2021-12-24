import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileDataConflict } from 'src/app/core/api/models';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({ providedIn: 'root' })
export class ConflictManagementService {
  conflicts: BehaviorSubject<Array<ProfileDataConflict>> = new BehaviorSubject<
    Array<ProfileDataConflict>
  >([]);
  public conflicts$: Observable<Array<ProfileDataConflict>> =
    this.conflicts.asObservable();
  private count: number;
  private hasVisitedConflictPage: boolean;

  constructor(private cacheService: CacheService) {}

  public getHasVisitedConflictPage(): boolean {
    return this.hasVisitedConflictPage
      ? this.hasVisitedConflictPage
      : JSON.parse(this.cacheService.get('hasVisitedConflictPage'));
  }
  public setHasVisitedConflictPage(hasVisitedConflictPage: boolean): void {
    this.hasVisitedConflictPage = hasVisitedConflictPage;
    this.cacheService.set('hasVisitedConflictPage', hasVisitedConflictPage);
  }

  public setConflicts(conflicts: Array<ProfileDataConflict>): void {
    this.conflicts.next(conflicts);
  }

  public getConflicts(): Observable<Array<ProfileDataConflict>> {
    return this.conflicts$;
  }

  public getCount(): number {
    return this.count ? this.count : JSON.parse(this.cacheService.get('count'));
  }

  public setCount(count: number): void {
    this.count = count;
    this.cacheService.set('count', count);
  }
}
