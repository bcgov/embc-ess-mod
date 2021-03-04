import { Injectable } from '@angular/core';
import { Profile } from 'src/app/core/api/models';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({ providedIn: 'root' })
export class ProfileDataService {

    private loginProfile: Profile;
    private profile: Profile;
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

    public setProfileId(profileId: string): void {
        this.profileId = profileId;
    }

    public getProfileId(): string {
        return this.profileId;
    }

}
