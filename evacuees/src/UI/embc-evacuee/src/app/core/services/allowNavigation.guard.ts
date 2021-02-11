import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { ProfileApiService } from './api/profileApi.service';
import { ProfileMappingService } from './mappings/profileMapping.service';

@Injectable({ providedIn: 'root' })
export class AllowNavigationGuard implements CanActivate {

    constructor(private router: Router, private regProfService: ProfileApiService, public mappingService: ProfileMappingService) { }

    public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Promise<boolean | UrlTree> {

        this.regProfService.getExistingProfile().subscribe(profile => {
            console.log(profile);
            this.mappingService.mapUserProfile(profile);
            if (state.url === '/verified-registration') {
                if (profile.isNewUser) {
                    this.router.navigate(['/verified-registration/collection-notice']);
                } else {
                    if (!profile.conflicts) {
                        this.router.navigate(['/verified-registration/dashboard']);
                    } else {
                        this.router.navigate(['/verified-registration/conflicts']);
                    }
                }
            }
        });
        return true;
    }
}
