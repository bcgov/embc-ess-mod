import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Profile, ProfileDataConflict } from 'src/app/core/api/models';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({ providedIn: 'root' })
export class ProfileDataService {

    private loginProfile: Profile;
    private profile: Profile;
    private conflicts: BehaviorSubject<Array<ProfileDataConflict>> = new BehaviorSubject<Array<ProfileDataConflict>>([]);
    public conflicts$: Observable<Array<ProfileDataConflict>> = this.conflicts.asObservable();
    private profileId: string;

    constructor(private cacheService: CacheService) { }

    public getProfile(): Profile {
        if (this.profile === null || undefined) {
            this.profile = JSON.parse(this.cacheService.get('profile'));
        }
        return this.profile;
    }

    public setProfile(profile: Profile): void {
        this.profile = profile;
        this.cacheService.set('profile', profile);
    }

    public getLoginProfile(): Profile {
        if (this.loginProfile === null || undefined) {
            this.loginProfile = JSON.parse(this.cacheService.get('loginProfile'));
        }
        return this.loginProfile;
    }
    public setLoginProfile(loginProfile: Profile): void {
        this.loginProfile = loginProfile;
        this.cacheService.set('loginProfile', loginProfile);
    }

    public setConflicts(conflicts: Array<ProfileDataConflict>): void {
        this.conflicts.next(conflicts);
    }

    public getConflicts(): Observable<Array<ProfileDataConflict>> {
        return this.conflicts$;
    }

    public setProfileId(profileId: string): void {
        this.profileId = profileId;
    }

    public getProfileId(): string {
        return this.profileId;
    }

}
