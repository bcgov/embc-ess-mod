import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileDataConflict } from 'src/app/core/api/models';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({ providedIn: 'root' })
export class ConflictManagementService {

    private hasVisitedConflictPage: boolean;
    private conflicts: BehaviorSubject<Array<ProfileDataConflict>> = new BehaviorSubject<Array<ProfileDataConflict>>([]);
    public conflicts$: Observable<Array<ProfileDataConflict>> = this.conflicts.asObservable();
    private count: number;

    constructor(private cacheService: CacheService) { }

    public getHasVisitedConflictPage(): boolean {
        if (this.hasVisitedConflictPage === null || undefined) {
            this.hasVisitedConflictPage = JSON.parse(this.cacheService.get('hasVisitedConflictPage'));
        }
        return this.hasVisitedConflictPage;
    }
    public setHasVisitedConflictPage(hasVisitedConflictPage: boolean) {
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
        if (this.count === null || this.count === undefined) {
            this.count = JSON.parse(this.cacheService.get('count'));
        }
        return this.count;
    }

    public setCount(count: number): void {
        this.count = count;
        this.cacheService.set('count', count);
    }

}
